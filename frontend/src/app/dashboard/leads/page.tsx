"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import KPIGroup from "@/components/dashboard/KPIGroup";
import CustomerList, { CustomerItem } from "@/components/dashboard/CustomerList";
import AppSelect from "@/components/ui/AppSelect";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { getMyInstitution, getInstitutionBranches, getInstitutionCourses, analyticsAPI, authAPI, metricsAPI, enquiriesAPI } from "@/lib/api";
import { withAuth } from "@/lib/auth-context";
import { getSocket } from "@/lib/socket";
import { motion, AnimatePresence } from "framer-motion";
import StatCard from "@/components/dashboard/StatCard";
import TimeRangeToggle, { TimeRangeValue } from "@/components/ui/TimeRangeToggle";

function CustomersPage() {
	const [customerKpiRange, setCustomerKpiRange] = useState<"Weekly"|"Monthly"|"Yearly">("Weekly");
	const [customerTimeRange, setCustomerTimeRange] = useState<"Weekly"|"Monthly"|"Yearly">("Weekly");
	const [customers, setCustomers] = useState<CustomerItem[]>([]);
	const [baseCustomers, setBaseCustomers] = useState<CustomerItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
	const [selectedProgram, setSelectedProgram] = useState<string>("Choose Program to see");
	const [courseOptions, setCourseOptions] = useState<string[]>(["Choose Program to see"]);
	const [institutionId, setInstitutionId] = useState<string | null>(null);
	const [ownerId, setOwnerId] = useState<string | null>(null);

	const [kpiViews, setKpiViews] = useState<number>(0);
	const [kpiCallbacks, setKpiCallbacks] = useState<number>(0);
	const [kpiDemos, setKpiDemos] = useState<number>(0);
	const [kpiLeads, setKpiLeads] = useState<number>(0);
	const [kpiViewsDelta, setKpiViewsDelta] = useState<{value:number; isPositive:boolean}>({value:0,isPositive:true});
	const [kpiCallbacksDelta, setKpiCallbacksDelta] = useState<{value:number; isPositive:boolean}>({value:0,isPositive:true});
	const [kpiDemosDelta, setKpiDemosDelta] = useState<{value:number; isPositive:boolean}>({value:0,isPositive:true});
	const [isKpiLoading, setIsKpiLoading] = useState<boolean>(false);

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
				metricsAPI.getOwnerByRange('views', range) as any,
				metricsAPI.getOwnerByRange('leads', range) as any,
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
				const mapped: CustomerItem[] = enquiries.map((enquiry: any, idx: number) => ({
					date: new Date(enquiry.createdAt || Date.now() - idx * 86400000).toLocaleDateString('en-GB'),
					name: enquiry.customerName || `Customer ${idx + 1}`,
					id: String(enquiry._id || idx),
					status: enquiry.enquiryType || "Requested for callback",
					// do not show program interest in list, but keep for filtering
					program: enquiry.programInterest || undefined,
					email: enquiry.customerEmail || undefined,
					phone: enquiry.customerPhone || undefined,
					address: (enquiry.customer?.customerAddress || enquiry.institution?.headquartersAddress || enquiry.institution?.locationURL || enquiry.institution?.institutionName) || undefined,
					timestampMs: enquiry.createdAt ? new Date(enquiry.createdAt).getTime() : (Date.now() - idx * 86400000)
				}));
				setBaseCustomers(mapped);
				// Build program options from all enquiries across all institutions
				const programSet = new Set<string>();
				mapped.forEach(m => { if (m.program) programSet.add(m.program); });
				setCourseOptions(["Choose Program to see", ...Array.from(programSet)]);
			}
		} catch {}
	}, []);

	const applyListFilters = (source: CustomerItem[], programLabel: string, rangeLabel: "Weekly"|"Monthly"|"Yearly") => {
		const now = Date.now();
		const windowMs = rangeLabel === 'Weekly' ? 7*24*60*60*1000 : rangeLabel === 'Monthly' ? 30*24*60*60*1000 : 365*24*60*60*1000;
		const start = now - windowMs;
		const filtered = source.filter(c => {
			const inRange = (c.timestampMs ?? now) >= start && (c.timestampMs ?? now) <= now;
			const programOk = programLabel === 'Choose Program to see' || !c.program || c.program === programLabel;
			return inRange && programOk;
		});
		setCustomers(filtered);
		if (filtered.length > 0) setSelectedCustomer(filtered[0]);
	};

	const handleListRangeClick = (rangeLabel: "Weekly"|"Monthly"|"Yearly") => {
		setCustomerTimeRange(rangeLabel);
		applyListFilters(baseCustomers, selectedProgram, rangeLabel);
	};

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const inst = await getMyInstitution();
				if (!mounted || !inst?._id) { setIsLoading(false); return; }
				setInstitutionId(inst._id);
				setIsLoading(true);
				await Promise.all([
					fetchKPIs(customerKpiRange),
					fetchList()
				]);
				setIsLoading(false);
			} catch {
				setIsLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, [fetchKPIs, fetchList]);

	// When KPI time range changes, refresh only KPIs (do not touch list)
	useEffect(() => {
		(async () => {
			try { await fetchKPIs(customerKpiRange); } catch {}
		})();
	}, [customerKpiRange, fetchKPIs]);

	// When list program or range changes, re-filter from base
	useEffect(() => {
		applyListFilters(baseCustomers, selectedProgram, customerTimeRange);
	}, [baseCustomers, selectedProgram, customerTimeRange]);

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
					let oid = ownerId;
					if (!oid) {
						try {
							const prof = await authAPI.getProfile();
							oid = (prof as any)?.data?.id;
						} catch {}
					}
					if (oid) s.emit('joinOwner', oid);
				});
				s.on('courseViewsUpdated', async () => {
					try {
						const latest = await metricsAPI.getOwnerByRange('views', normalizeRange(customerKpiRange));
						if ((latest as any)?.success) setKpiViews(((latest as any).data?.totalViews) || 0);
					} catch {}
				});
				s.on('ownerTotalLeads', async () => {
					try {
						const latest = await metricsAPI.getOwnerByRange('leads', normalizeRange(customerKpiRange));
						if ((latest as any)?.success) setKpiLeads(((latest as any).data?.totalLeads) || 0);
					} catch {}
				});
				s.on('enquiryCreated', async () => {
					try {
						await Promise.all([
							enquiriesAPI.getTypeSummaryRollups(normalizeRange(customerKpiRange)).then((r:any)=>{ if (r?.success) { setKpiCallbacks(r.data?.callbacks||0); setKpiDemos(r.data?.demos||0); } }),
							fetchList()
						]);
					} catch {}
				});
			} catch {}
		})();
		return () => { try { s?.off('courseViewsUpdated'); s?.off('ownerTotalLeads'); s?.off('enquiryCreated'); } catch {} };
	}, [institutionId, customerKpiRange, fetchList]);

	return (
		<div className="p-2 mt-5">
			<Card className="mx-2 sm:mx-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
				<CardContent className="p-4 sm:p-6">
					<div className="px-0 sm:px-0">
						{/* Header and KPI cards area matching main dashboard/analytics */}
						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2 mb-4 sm:mb-6 m-0">
							<div className="text-lg sm:text-sm md:text-2xl font-semibold">Leads management</div>
							<div className="ml-0 sm:ml-auto flex items-center gap-2 w-full sm:w-auto">
								<TimeRangeToggle value={customerKpiRange as TimeRangeValue} onChange={setCustomerKpiRange as any} />
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
										className={`rounded-sm px-4 ${customerTimeRange===r ? 'bg-indigo-100 text-gray-900' : 'text-gray-900'}`}
									>
										{r}
									</Button>
								))}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 p-2">
						<div className="lg:col-span-2">
							<CustomerList 
								key={`${customerTimeRange}-${selectedProgram}-${baseCustomers.length}`}
								items={customers} 
								isLoading={isLoading}
								onCustomerClick={(customer) => setSelectedCustomer(customer)}
								onCustomerHover={(customer) => setSelectedCustomer(customer)}
								hideActions
								selectionMode="hover"
							/>
						</div>
						<div className="lg:col-span-1">
							<Card className="bg-white border border-gray-100 rounded-2xl dark:bg-gray-900 dark:border-gray-800">
								<CardContent className="p-6">
									<h4 className="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-100">Lead Details</h4>
									<p className="text-sm text-gray-500 mb-4 dark:text-gray-300">Detailed information about the selected lead</p>
									{selectedCustomer ? (
										<div className="space-y-5">
											<div className="flex items-center gap-3 flex-nowrap">		
												<div>
													<div className="flex items-center gap-3 flex-nowrap">
														<div className="h-11 w-11 rounded-full bg-yellow-400 flex items-center justify-center text-gray-700 text-lg">
															{selectedCustomer.name.charAt(0)}
														</div>
														<div>
															<div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{selectedCustomer.name}</div>
															<div className="text-sm text-gray-400">#{selectedCustomer.id}</div>
														</div>
													</div>
													<div className="space-y-3 text-sm mt-3 ml-14">
														{selectedCustomer.phone && (
															<div className="text-gray-700 dark:text-gray-200 flex items-center gap-2">
																<FontAwesomeIcon icon={faPhone} className="text-gray-400" />
																<span className="text-[15px]">{selectedCustomer.phone}</span>
															</div>
														)}
														{selectedCustomer.email && (
															<div className="text-gray-700 dark:text-gray-200 flex items-center gap-2">
																<FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
																<span className="text-[15px]">{selectedCustomer.email}</span>
															</div>
														)}
														{selectedCustomer.address && (
															<div className="text-gray-700 dark:text-gray-200 flex items-center gap-2">
																<FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
																<span className="text-[15px]">{selectedCustomer.address}</span>
																</div>
														)}
													</div>
												</div>
											</div>
											<Button className="rounded-md px-6 py-2 mx-auto block bg-blue-600 text-white">{selectedCustomer.status}</Button>
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

export default withAuth(CustomersPage);
