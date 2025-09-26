"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import KPIGroup from "@/components/dashboard/KPIGroup";
import StudentList, { StudentItem } from "@/components/dashboard/StudentList";
import AppSelect from "@/components/ui/AppSelect";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { getInstitutionBranches, getInstitutionCourses, analyticsAPI, authAPI, metricsAPI, enquiriesAPI } from "@/lib/api";
import { withAuth } from "@/lib/auth-context";
import { getSocket } from "@/lib/socket";
import { motion, AnimatePresence } from "framer-motion";
import StatCard from "@/components/dashboard/StatCard";
import TimeRangeToggle, { TimeRangeValue } from "@/components/ui/TimeRangeToggle";
import { useInfiniteLeads, useInstitution } from "@/lib/hooks/dashboard-hooks";
import { useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/ui/loading";

function LeadsPage() {
	const [leadKpiRange, setLeadKpiRange] = useState<"Weekly"|"Monthly"|"Yearly">("Weekly");
	const [leadTimeRange, setLeadTimeRange] = useState<"Weekly"|"Monthly"|"Yearly">("Weekly");
	const [students, setStudents] = useState<StudentItem[]>([]);
	const [baseStudents, setBaseStudents] = useState<StudentItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
	const [selectedProgram, setSelectedProgram] = useState<string>("Choose Program to see");
	const [courseOptions, setCourseOptions] = useState<string[]>(["Choose Program to see"]);
	const [institutionId, setInstitutionId] = useState<string | null>(null);
	const [institutionAdminId, setInstitutionAdminId] = useState<string | null>(null);

	const [kpiViews, setKpiViews] = useState<number>(0);
	const [kpiCallbacks, setKpiCallbacks] = useState<number>(0);
	const [kpiDemos, setKpiDemos] = useState<number>(0);
	const [kpiLeads, setKpiLeads] = useState<number>(0);
	const [kpiViewsDelta, setKpiViewsDelta] = useState<{value:number; isPositive:boolean}>({value:0,isPositive:true});
	const [kpiCallbacksDelta, setKpiCallbacksDelta] = useState<{value:number; isPositive:boolean}>({value:0,isPositive:true});
	const [kpiDemosDelta, setKpiDemosDelta] = useState<{value:number; isPositive:boolean}>({value:0,isPositive:true});
	const [isKpiLoading, setIsKpiLoading] = useState<boolean>(false);

	const queryClient = useQueryClient();
	const { data: institution } = useInstitution();
	const { data: pages, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteLeads(10);
	const sentinelRef = React.useRef<HTMLDivElement | null>(null);

	const computeTrend = (current: number, previous: number) => {
		if (previous <= 0) return { value: current > 0 ? 100 : 0, isPositive: current > 0 };
		const change = ((current - previous) / previous) * 100;
		return { value: Math.abs(change), isPositive: change >= 0 };
	};

	const normalizeRange = (r: "Weekly"|"Monthly"|"Yearly"): 'weekly'|'monthly'|'yearly' => r.toLowerCase() as any;

	const fetchKPIs = useCallback(async (rangeLabel: "Weekly"|"Monthly"|"Yearly") => {
		const range = normalizeRange(rangeLabel);
		try {
			setIsKpiLoading(true);
			const [{ data: viewsNow }, { data: leadsNow }, typeRollups] = await Promise.all([
				metricsAPI.getInstitutionAdminByRange('views', range) as any,
				metricsAPI.getInstitutionAdminByRange('leads', range) as any,
				enquiriesAPI.getTypeSummaryRollups(range) as any
			]);
			setKpiViews(viewsNow?.totalViews || 0);
			setKpiLeads(leadsNow?.totalLeads || 0);
			setKpiCallbacks(typeRollups?.data?.callbacks || 0);
			setKpiDemos(typeRollups?.data?.demos || 0);
			if (viewsNow?.trend) setKpiViewsDelta(viewsNow.trend);
		} catch (e) {} finally {
			setIsKpiLoading(false);
		}
	}, []);

	const fetchList = useCallback(async () => {
		try {
			const recent = await enquiriesAPI.getRecentEnquiries();
			if ((recent as any)?.success && Array.isArray((recent as any).data?.enquiries)) {
				const enquiries = (recent as any).data.enquiries;
				const mapped: StudentItem[] = enquiries.map((enquiry: any, idx: number) => ({
					date: new Date(enquiry.createdAt || Date.now() - idx * 86400000).toLocaleDateString('en-GB'),
					name: enquiry.studentName || `Student ${idx + 1}`,
					id: String(enquiry._id || idx),
					status: enquiry.enquiryType || "Requested for callback",
					program: enquiry.programInterest || undefined,
					email: enquiry.studentEmail || undefined,
					phone: enquiry.studentPhone || undefined,
					address: (enquiry.student?.studentAddress || enquiry.institution?.headquartersAddress || enquiry.institution?.locationURL || enquiry.institution?.institutionName) || undefined,
					timestampMs: enquiry.createdAt ? new Date(enquiry.createdAt).getTime() : (Date.now() - idx * 86400000)
				}));
				// Only seed base list if still empty (infinite query will handle main list)
				if (baseStudents.length === 0) {
					setBaseStudents(mapped);
				}
				const programSet = new Set<string>();
				mapped.forEach(m => { if (m.program) programSet.add(m.program); });
				setCourseOptions(["Choose Program to see", ...Array.from(programSet)]);
			}
		} catch (err) { console.error('Leads: initial fetch failed', err); }
	}, [baseStudents.length]);

	const applyListFilters = (source: StudentItem[], programLabel: string, rangeLabel: "Weekly"|"Monthly"|"Yearly") => {
		const now = Date.now();
		const windowMs = rangeLabel === 'Weekly' ? 7*24*60*60*1000 : rangeLabel === 'Monthly' ? 30*24*60*60*1000 : 365*24*60*60*1000;
		const start = now - windowMs;
		const filtered = source.filter(c => {
			const inRange = (c.timestampMs ?? now) >= start && (c.timestampMs ?? now) <= now;
			const programOk = programLabel === 'Choose Program to see' || !c.program || c.program === programLabel;
			return inRange && programOk;
		});
		setStudents(filtered);
		if (filtered.length > 0) setSelectedStudent(filtered[0]);
	};

	const handleListRangeClick = (rangeLabel: "Weekly"|"Monthly"|"Yearly") => {
		setLeadTimeRange(rangeLabel);
		applyListFilters(baseStudents, selectedProgram, rangeLabel);
	};

	const statusColorClass = (status?: string) => {
		const s = (status || '').toLowerCase();
		if (s.includes('demo')) return 'bg-purple-600 hover:bg-purple-700';
		if (s.includes('callback')) return 'bg-blue-600 hover:bg-blue-700';
		if (s.includes('lead')) return 'bg-emerald-600 hover:bg-emerald-700';
		return 'bg-gray-600 hover:bg-gray-700';
	};

	// Update baseStudents from IndexedDB infinite pages, keep UI intact
	useEffect(() => {
		const p = (pages?.pages as any[]) || [];
		if (p) setIsLoading(false);
		const flat = p.flat() as any[];
		if (flat.length) {
			const mapped: StudentItem[] = flat.map((c: any, idx: number) => {
				const stableId = String(c.studentId || c.id || `${c.timestampMs || ''}-${c.email || ''}-${idx}`);
				return {
					date: c.date || new Date(c.timestampMs || Date.now()).toLocaleDateString('en-GB'),
					name: c.name,
					id: stableId,
					status: c.status || 'Requested for callback',
					program: c.programInterests?.[0],
					email: c.email,
					phone: c.phone,
					address: c.address,
					timestampMs: c.timestampMs || Date.now(),
					programInterests: c.programInterests || (c.program ? [c.program] : undefined)
				};
			});
			// Deduplicate by id to avoid React key collisions
			const seen = new Set<string>();
			const unique = mapped.filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; });
			setBaseStudents(unique);
			applyListFilters(unique, selectedProgram, leadTimeRange);
		}
	}, [pages, selectedProgram, leadTimeRange]);

	// IntersectionObserver sentinel for next page (exactly at end)
	useEffect(() => {
		const el = sentinelRef.current;
		if (!el) return;

		// Find nearest scrollable parent to use as observer root
		const getScrollParent = (node: Element | null): Element | null => {
			if (!node) return null;
			const style = window.getComputedStyle(node as Element);
			const overflowY = style.getPropertyValue('overflow-y');
			const isScrollable = /(auto|scroll|overlay)/.test(overflowY);
			if (isScrollable) return node;
			return getScrollParent(node.parentElement);
		};

		const rootEl = getScrollParent(el.parentElement) || null;

		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					if (!isFetchingNextPage && hasNextPage) {
						fetchNextPage();
					}
				}
			}
		}, { root: rootEl, rootMargin: '0px', threshold: 1.0 });

		observer.observe(el);
		return () => {
			try { 
				observer.disconnect(); 
			} catch (disconnectError) {
				console.warn('Failed to disconnect intersection observer:', disconnectError);
				// Non-critical: observer will be garbage collected anyway
			}
		};
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				if (!institution?._id) { setIsLoading(false); return; }
				setInstitutionId(institution._id);
				setIsLoading(true);
				await Promise.all([
					fetchKPIs(leadKpiRange),
					fetchList()
				]);
				setIsLoading(false);
			} catch {
				setIsLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, [fetchKPIs, fetchList, institution, leadKpiRange]);

	// When KPI time range changes, refresh only KPIs (do not touch list)
	useEffect(() => {
		(async () => {
			try { await fetchKPIs(leadKpiRange); } catch (err) { console.error('Leads: KPI refresh failed', err); }
		})();
	}, [leadKpiRange, fetchKPIs]);

	// When list program or range changes, re-filter from base
	useEffect(() => {
		applyListFilters(baseStudents, selectedProgram, leadTimeRange);
	}, [baseStudents, selectedProgram, leadTimeRange]);

	// Socket for realtime updates
	useEffect(() => {
		if (!institutionId) return;
		let s: any;
		(async () => {
			try {
				const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
				let origin = apiBase.replace('/api','');
				if (!origin) origin = typeof window !== 'undefined' ? window.location.origin : '';
				s = await getSocket(origin);
				s.on('connect', async () => {
					s.emit('joinInstitution', institutionId);
					let oid = institutionAdminId;
					if (!oid) {
						try {
							const prof = await authAPI.getProfile();
							oid = (prof as any)?.data?.id;
						} catch (err) { console.error('Leads: profile fetch failed for institution admin room', err); }
					}
					if (oid) s.emit('joinInstitutionAdmin', oid);
				});
				s.on('courseViewsUpdated', async () => {
					try {
						const latest = await metricsAPI.getInstitutionAdminByRange('views', normalizeRange(leadKpiRange));
						if ((latest as any)?.success) setKpiViews(((latest as any).data?.totalViews) || 0);
					} catch (err) { console.error('Leads: realtime views refresh failed', err); }
				});
				s.on('institutionAdminTotalLeads', async () => {
					try {
						const latest = await metricsAPI.getInstitutionAdminByRange('leads', normalizeRange(leadKpiRange));
						if ((latest as any)?.success) setKpiLeads(((latest as any).data?.totalLeads) || 0);
					} catch (err) { console.error('Leads: realtime leads refresh failed', err); }
				});
				s.on('enquiryCreated', async () => {
					try {
						await Promise.all([
							enquiriesAPI.getTypeSummaryRollups(normalizeRange(leadKpiRange)).then((r:any)=>{ if (r?.success) { setKpiCallbacks(r.data?.callbacks||0); setKpiDemos(r.data?.demos||0); } }),
							queryClient.invalidateQueries({ queryKey: ['leads-infinite'] })
						]);
					} catch (err) { console.error('Leads: realtime enquiry refresh failed', err); }
				});
			} catch (err) { console.error('Leads: socket setup error', err); }
		})();
		return () => { try { s?.off('courseViewsUpdated'); s?.off('institutionAdminTotalLeads'); s?.off('enquiryCreated'); } catch (err) { console.error('Leads: socket cleanup error', err); } };
	}, [institutionId, leadKpiRange, queryClient]);

	return (
		<div className="p-2 mt-5">
			<Card className="mx-2 sm:mx-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
				<CardContent className="p-4 sm:p-6">
					<div className="px-0 sm:px-0">
						{/* Header and KPI cards area matching main dashboard/analytics */}
						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2 mb-4 sm:mb-6 m-0">
							<div className="text-lg sm:text-sm md:text-2xl font-semibold">Leads management</div>
							<div className="ml-0 sm:ml-auto flex items-center gap-2 w-full sm:w-auto">
								<TimeRangeToggle value={leadKpiRange as TimeRangeValue} onChange={setLeadKpiRange as any} />
							</div>
						</div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
						>
							<AnimatePresence mode="wait">
								<StatCard 
									title={<div className="text-left"><div className="hidden sm:block"><div>Program</div><div>Views</div></div><div className="block sm:hidden">Program Views</div></div>}
									value={kpiViews}
									trend={kpiViewsDelta}
									isLoading={isKpiLoading}
									showFilters={false}
								/>
							</AnimatePresence>
							<AnimatePresence mode="wait">
								<StatCard 
									title={<div className="text-left"><div className="hidden sm:block"><div>Callback</div><div>Leads</div></div><div className="block sm:hidden">Callback Leads</div></div>}
									value={kpiCallbacks}
									trend={kpiCallbacksDelta}
									isLoading={isKpiLoading}
									showFilters={false}
								/>
							</AnimatePresence>
							<AnimatePresence mode="wait">
								<StatCard 
									title={<div className="text-left"><div className="hidden sm:block"><div>Demo Request</div><div>Leads</div></div><div className="block sm:hidden">Demo Request Leads</div></div>}
									value={kpiDemos}
									trend={kpiDemosDelta}
									isLoading={isKpiLoading}
									showFilters={false}
								/>
							</AnimatePresence>
						</motion.div>
					</div>
				</CardContent>
			</Card>

			<Card className="mx-2 sm:mx-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl mt-4">
				<CardContent className="p-0 bg-gray-50 dark:bg-gray-900">
					<div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Lead List</div>
						<div className="flex items-center gap-2 w-full sm:w-auto">
							<AppSelect className="w-full sm:w-auto" value={selectedProgram} onChange={setSelectedProgram} options={courseOptions.length ? courseOptions : ["Choose Program to see"]} variant="white" size="md" rounded="lg" />
							<div className="flex flex-wrap items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-sm p-1 bg-white dark:bg-gray-800 w-full sm:w-auto">
								{(["Weekly","Monthly","Yearly"] as const).map(r => (
									<Button
										key={r}
										variant="ghost"
										size="sm"
										onClick={() => handleListRangeClick(r)}
										className={`rounded-sm px-4 ${leadTimeRange===r ? 'bg-indigo-100 text-gray-900' : 'text-gray-900'}`}
									>
										{r}
									</Button>
								))}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 p-2">
						<div className="lg:col-span-2">
							<StudentList 
								key={`${leadTimeRange}-${selectedProgram}-${baseStudents.length}`}
								items={students} 
								isLoading={isLoading}
								onStudentClick={(student) => setSelectedStudent(student)}
								onStudentHover={(student) => setSelectedStudent(student)}
								hideActions
								selectionMode="hover"
							/>
							{/* Loading indicator and sentinel at end of list */}
							{isFetchingNextPage && (
								<div className="py-4">
									<Loading />
								</div>
							)}
							<div ref={sentinelRef} style={{ height: 1 }} />
						</div>
						<div className="lg:col-span-1">
							<Card className="bg-white border border-gray-100 rounded-2xl dark:bg-gray-900 dark:border-gray-800">
								<CardContent className="p-6">
									<h4 className="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-100">Lead Details</h4>
									<p className="text-sm text-gray-500 mb-4 dark:text-gray-300">Detailed information about the selected lead</p>
									{selectedStudent ? (
										<div className="space-y-5">
											<div className="flex items-center gap-3 flex-nowrap">		
												<div>
													<div className="flex items-center gap-3 flex-nowrap">
														<div className="h-11 w-11 rounded-full bg-yellow-400 flex items-center justify-center text-gray-700 text-lg">
															{selectedStudent.name.charAt(0)}
														</div>
														<div>
															<div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{selectedStudent.name}</div>
															<div className="text-sm text-gray-400">#{selectedStudent.id}</div>
														</div>
													</div>
													<div className="space-y-3 text-sm mt-3 ml-14">
														{selectedStudent.phone && (
															<div className="text-gray-700 dark:text-gray-200 flex items-center gap-2">
																<FontAwesomeIcon icon={faPhone} className="text-gray-400" />
																<span className="text-[15px]">{selectedStudent.phone}</span>
															</div>
														)}
														{selectedStudent.email && (
															<div className="text-gray-700 dark:text-gray-200 flex items-center gap-2">
																<FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
																<span className="text-[15px]">{selectedStudent.email}</span>
															</div>
														)}
														{selectedStudent.address && (
															<div className="text-gray-700 dark:text-gray-200 flex items-center gap-2">
																<FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
																<span className="text-[15px]">{selectedStudent.address}</span>
															</div>
														)}
														</div>
												</div>
											</div>
											<Button className={`rounded-md px-6 py-2 mx-auto block text-white ${statusColorClass(selectedStudent.status)}`}>
												{selectedStudent.status}
											</Button>
										</div>
									) : (
										<div className="text-gray-500 dark:text-gray-400">Select a Lead to see details.</div>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default withAuth(LeadsPage);
