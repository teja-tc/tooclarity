"use client";


import React from "react";
import { useRouter } from "next/navigation";
import { withAuth, useAuth } from "../../lib/auth-context";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import AdCard from "@/components/dashboard/AdCard";
import CustomerList, {
  CustomerItem,
} from "@/components/dashboard/CustomerList";
import CourseReachChart from "@/components/dashboard/CourseReachChart";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import {
  getMyInstitution,
  getInstitutionBranches,
  getInstitutionCourses,
} from "@/lib/api";
import { authAPI, metricsAPI, enquiriesAPI } from "@/lib/api";
import { getSocket } from "@/lib/socket";

interface DashboardStatsData {
	courseViews: number;
	courseComparisons: number;
	contactRequests: number;
	courseViewsTrend: { value: number; isPositive: boolean };
	courseComparisonsTrend: { value: number; isPositive: boolean };
	contactRequestsTrend: { value: number; isPositive: boolean };
}

interface FilterState {
	course: string;
	timeRange: 'weekly' | 'monthly' | 'yearly';
}

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.1, duration: 0.3 }
	}
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function DashboardPage() {
	const [stats, setStats] = useState<DashboardStatsData>({
		courseViews: 0,
		courseComparisons: 0,
		contactRequests: 0,
		courseViewsTrend: { value: 0, isPositive: true },
		courseComparisonsTrend: { value: 0, isPositive: true },
		contactRequestsTrend: { value: 0, isPositive: true }
	});
	const [filters, setFilters] = useState<FilterState>({ course: "All Courses", timeRange: 'weekly' });
	const [customers, setCustomers] = useState<CustomerItem[]>([]);
	const [isStatsLoading, setIsStatsLoading] = useState(true);
	const [isListLoading, setIsListLoading] = useState(true);
	const [institutionId, setInstitutionId] = useState<string | null>(null);
	const [ownerId, setOwnerId] = useState<string | null>(null);
	const [chartValues, setChartValues] = useState<number[] | null>(null);
	const [baselineCourseViews, setBaselineCourseViews] = useState<number>(0);
	const [rangeBaseline, setRangeBaseline] = useState<number>(0);

	const generateCustomers = useCallback(() => {
		const names = [
			"Raghavendar Reddy", "Sarah Johnson", "Michael Chen", "Emily Davis",
			"David Wilson", "Lisa Anderson", "James Brown", "Maria Garcia",
			"Robert Taylor", "Jennifer Martinez", "William Jones", "Ashley White"
		];
		const statuses = [
			"Requested for callback", "Requested for demo",
		];
		const programs = [
			"BTech Computer Science", "MBA Marketing", "BSc Data Science", "BCom Finance",
			"BTech Mechanical", "MSc AI", "BA Economics"
		];
		const newCustomers: CustomerItem[] = Array.from({ length: 4 }, (_, i) => ({
			date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
			name: names[Math.floor(Math.random() * names.length)],
			id: (181200 + i).toString(),
			status: statuses[Math.floor(Math.random() * statuses.length)],
			programInterests: [programs[Math.floor(Math.random() * programs.length)]]
		}));
		setCustomers(newCustomers);
	}, []);

	// Fetch KPI stats only (views, comparisons, leads) for a given range
	const fetchDataWithTrends = useCallback(async (range: 'weekly' | 'monthly' | 'yearly') => {
		try {
			const [viewsData, comparisonsData, leadsData] = await Promise.all([
				metricsAPI.getOwnerByRange('views', range),
				metricsAPI.getOwnerByRange('comparisons', range),
				metricsAPI.getOwnerByRange('leads', range)
			]);

			if ((viewsData as any)?.success) {
				const data = (viewsData as any).data;
				setStats(prev => ({ 
					...prev, 
					courseViews: data.totalViews || 0,
					courseViewsTrend: data.trend || { value: 0, isPositive: true }
				}));
			}
			
			if ((comparisonsData as any)?.success) {
				const data = (comparisonsData as any).data;
				setStats(prev => ({ 
					...prev, 
					courseComparisons: data.totalComparisons || 0,
					courseComparisonsTrend: data.trend || { value: 0, isPositive: true }
				}));
			}
			
			if ((leadsData as any)?.success) {
				const data = (leadsData as any).data;
				setStats(prev => ({ 
					...prev, 
					contactRequests: data.totalLeads || 0,
					contactRequestsTrend: data.trend || { value: 0, isPositive: true }
				}));
			}
		} catch (err) {
			console.error('❌ Failed to fetch trends data:', err);
		}
	}, []);

	// Fetch recent enquiries and chart (independent of range)
	const fetchRecentAndChart = useCallback(async () => {
		try {
			const [recentEnquiries, seriesRes] = await Promise.all([
				enquiriesAPI.getRecentEnquiries(),
				metricsAPI.getOwnerSeries('views', new Date().getFullYear())
			]);

			if ((recentEnquiries as any)?.success && Array.isArray((recentEnquiries as any).data?.enquiries)) {
				const enquiries = (recentEnquiries as any).data.enquiries;
				const mapped: CustomerItem[] = enquiries.map((enquiry: any, idx: number) => ({
					date: new Date(enquiry.createdAt || Date.now() - idx * 86400000).toLocaleDateString('en-GB'),
					name: enquiry.customerName || `Customer ${idx + 1}`,
					id: String(enquiry._id || idx),
					status: enquiry.enquiryType || "Requested for callback",
					programInterests: [enquiry.programInterest || "General Interest"]
				}));
				setCustomers(mapped.slice(0, 4));
			}

			if ((seriesRes as any)?.success && Array.isArray((seriesRes as any).data?.series)) {
				const series = (seriesRes as any).data.series as number[];
				const arr = new Array(12).fill(0);
				series.forEach((count, monthIdx) => {
					if (monthIdx >= 0 && monthIdx < 12) arr[monthIdx] = count || 0;
				});
				setChartValues(arr);
			}
		} catch (e) {
			console.error('❌ Failed to fetch recent enquiries/chart:', e);
		}
	}, []);

	useEffect(() => {
		let mounted = true;
		async function fetchData() {
			try {
				const inst = await getMyInstitution();
				if (!mounted || !inst?._id) {
					setIsStatsLoading(false);
					setIsListLoading(false);
					return;
				}
				setInstitutionId(inst._id);
				if (inst.owner) setOwnerId(String(inst.owner));
				setIsStatsLoading(true);
				setIsListLoading(true);
				await Promise.all([
					fetchDataWithTrends(filters.timeRange),
					fetchRecentAndChart()
				]);
				setIsStatsLoading(false);
				setIsListLoading(false);
			} catch (err) {
				console.error('Failed to fetch backend data:', err);
				generateCustomers();
				setIsStatsLoading(false);
				setIsListLoading(false);
			}
		}
		fetchData();
		return () => { mounted = false; };
	}, [generateCustomers, fetchDataWithTrends, fetchRecentAndChart]);

	// Setup socket for live updates (only adjust recent list and stats as needed)
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
							setOwnerId(oid || null);
						} catch {}
					}
					if (oid) s.emit('joinOwner', oid);
				});
				s.on('courseViewsUpdated', async () => {
					try {
						const [latest, series] = await Promise.all([
							metricsAPI.getOwnerByRange('views', filters.timeRange),
							metricsAPI.getOwnerSeries('views', new Date().getFullYear())
						]);
						if ((latest as any)?.success) {
							const current = (latest as any).data?.totalViews ?? 0;
							setStats(prev => ({ ...prev, courseViews: current }));
						}
						if ((series as any)?.success && Array.isArray((series as any).data?.series)) {
							const arr = new Array(12).fill(0);
							(series as any).data.series.forEach((count: number, idx: number) => { if (idx >= 0 && idx < 12) arr[idx] = count || 0; });
							setChartValues(arr);
						}
					} catch {}
				});
				s.on('comparisonsUpdated', async () => {
					try {
						const latest = await metricsAPI.getOwnerByRange('comparisons', filters.timeRange);
						if ((latest as any)?.success) {
							const current = (latest as any).data?.totalComparisons ?? 0;
							setStats(prev => ({ ...prev, courseComparisons: current }));
						}
					} catch {}
				});
				s.on('enquiryCreated', async () => {
					try {
						// Refresh recent list only
						setIsListLoading(true);
						await fetchRecentAndChart();
						setIsListLoading(false);
					} catch {}
				});
				s.on('ownerTotalLeads', async () => {
					try {
						const latest = await metricsAPI.getOwnerByRange('leads', filters.timeRange);
						if ((latest as any)?.success) {
							const current = (latest as any).data?.totalLeads ?? 0;
							setStats(prev => ({ ...prev, contactRequests: current }));
						}
					} catch {}
				});
				s.on('connect_error', () => {});
			} catch {}
		})();
		return () => { try { s?.off('courseViewsUpdated'); s?.off('comparisonsUpdated'); s?.off('enquiryCreated'); s?.off('ownerTotalLeads'); } catch {} };
	}, [institutionId, ownerId, filters.timeRange, fetchRecentAndChart]);

	const handleFilterChange = async (newFilters: FilterState) => {
		const normalized: FilterState = { ...newFilters, timeRange: (newFilters.timeRange || 'weekly') };
		setFilters(normalized);
		// Refresh KPIs only; do not refresh recent enquiries list on range change
		setIsStatsLoading(true);
		await fetchDataWithTrends(normalized.timeRange);
		setIsStatsLoading(false);
	};

	return (
		<motion.div 
			className="w-full"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			<motion.div 
				className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6 mt-2 sm:mt-5 rounded-2xl"
				variants={itemVariants}
			>
				<div className="xl:col-span-2 bg-gray-50 dark:bg-gray-900 rounded-2xl mt-0">
					<DashboardStats
						stats={stats}
						filters={filters}
						isLoading={isStatsLoading}
						onFilterChange={handleFilterChange}
					/>
				</div>
				<div className="xl:col-span-1">
					<AdCard onShare={() => {}} />
				</div>
			</motion.div>

			<motion.div 
				className="grid grid-cols-1 mb-4 sm:mb-6"
				variants={itemVariants}
			>
				<div className="xl:col-span-2">
					<CustomerList 
						items={customers} 
						isLoading={isListLoading}
						title="Recent enquiries"
						statusLabel="Inquiry type"
						useDashboardColumns
						onCustomerClick={() => {}}
						onStatusChange={() => {}}
					/>
				</div>
			</motion.div>

			<motion.div 
				variants={itemVariants}
				className="-mx-2 sm:-mx-4 lg:-mx-6"
			>
				<CourseReachChart 
					timeRange={filters.timeRange}
					course={filters.course}
					values={chartValues ?? new Array(12).fill(0)}
					onDataPointClick={() => {}}
					yTicksOverride={[0,50000,100000,150000,200000,250000]}
				/>
			</motion.div>
		</motion.div>
	);
}

export default withAuth(DashboardPage); 