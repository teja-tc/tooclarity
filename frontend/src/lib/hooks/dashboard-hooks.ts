import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { 
  authAPI, 
  metricsAPI, 
  enquiriesAPI, 
  getMyInstitution,
  ApiResponse 
} from '../api';
import {
  DashboardStatsCache as DashboardStats,
  DashboardStudentCache as StudentItem,
  DashboardChartCache as ChartData,
  DashboardInstitutionCache as Institution,
  saveDashboardStatsCache as saveDashboardStats,
  getDashboardStatsCache as getDashboardStats,
  saveDashboardStudentsCache as saveStudents,
  getDashboardStudentsCache as getStudents,
  saveDashboardChartCache as saveChartData,
  getDashboardChartCache as getChartData,
  saveDashboardInstitutionCache as saveInstitution,
  getDashboardInstitutionCache as getInstitution,
  getDashboardStudentsPage,
  prependDashboardStudents,
  CACHE_DURATION,
  replaceDashboardStudentsWithLatestTen,
  prependAndTrimDashboardStudents
} from '../localDb';

// Query keys
export const QUERY_KEYS = {
  INSTITUTION: (id?: string) => ['institution', id],
  DASHBOARD_STATS: (timeRange: string, institutionId?: string) => 
    ['dashboard-stats', timeRange, institutionId],
  STUDENTS: (institutionId?: string) => ['students', institutionId],
  CHART_DATA: (type: string, year: number, institutionId?: string) => 
    ['chart-data', type, year, institutionId],
  RECENT_ENQUIRIES: (institutionId?: string) => ['recent-enquiries', institutionId],
  METRICS: (metric: string, range: string, institutionId?: string) => 
    ['metrics', metric, range, institutionId],
} as const;

// Institution hook
export function useInstitution() {
  return useQuery({
    queryKey: QUERY_KEYS.INSTITUTION(),
    queryFn: async (): Promise<Institution> => {
      // Try cache first
      const cached = await getInstitution('current');
      if (cached && Date.now() - cached.lastUpdated < CACHE_DURATION.INSTITUTION) {
        return cached;
      }

      // Fetch from API
      const response = await getMyInstitution();
      if (!response || !response._id) {
        throw new Error('No institution found');
      }

      const institution: Institution = {
        _id: response._id,
        instituteName: response.instituteName || '',
        institutionAdmin: response.institutionAdmin ? String(response.institutionAdmin) : undefined,
        lastUpdated: Date.now()
      } as Institution;

      // Save to cache
      await saveInstitution(institution);
      
      return institution;
    },
    staleTime: CACHE_DURATION.INSTITUTION,
    retry: 2,
  });
}

// Dashboard stats hook
export function useDashboardStats(timeRange: 'weekly' | 'monthly' | 'yearly' = 'monthly') {
  const { data: institution } = useInstitution();
  
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_STATS(timeRange, institution?._id),
    queryFn: async (): Promise<DashboardStats> => {
      if (!institution?._id) {
        throw new Error('Institution not available');
      }

      // Try cache first
      const cached = await getDashboardStats(timeRange, institution._id);
      if (cached && Date.now() - cached.lastUpdated < CACHE_DURATION.STATS) {
        return cached;
      }

      // Fetch from API
      const [viewsData, comparisonsData, leadsData] = await Promise.all([
        metricsAPI.getInstitutionAdminByRange('views', timeRange),
        metricsAPI.getInstitutionAdminByRange('comparisons', timeRange),
        metricsAPI.getInstitutionAdminByRange('leads', timeRange)
      ]);

      const stats: DashboardStats = {
        courseViews: (viewsData as any)?.data?.totalViews || 0,
        courseComparisons: (comparisonsData as any)?.data?.totalComparisons || 0,
        contactRequests: (leadsData as any)?.data?.totalLeads || 0,
        courseViewsTrend: (viewsData as any)?.data?.trend || { value: 0, isPositive: true },
        courseComparisonsTrend: (comparisonsData as any)?.data?.trend || { value: 0, isPositive: true },
        contactRequestsTrend: (leadsData as any)?.data?.trend || { value: 0, isPositive: true },
        timeRange,
        institutionId: institution._id,
        lastUpdated: Date.now()
      } as DashboardStats;

      // Save to cache
      await saveDashboardStats(stats);
      
      return stats;
    },
    enabled: !!institution?._id,
    staleTime: CACHE_DURATION.STATS,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes when active
  });
}

// Recent students/enquiries hook
export function useRecentStudents() {
  const { data: institution } = useInstitution();
  
  return useQuery({
    queryKey: QUERY_KEYS.STUDENTS(institution?._id),
    queryFn: async (): Promise<StudentItem[]> => {
      if (!institution?._id) {
        throw new Error('Institution not available');
      }

      // Try cache first
      const cached = await getStudents(institution._id);
      if (cached.length > 0 && cached[0] && Date.now() - cached[0].lastUpdated < CACHE_DURATION.STUDENTS) {
        return cached.slice(0, 4); // Return only recent 4
      }

      // Fetch from API
      const response = await enquiriesAPI.getRecentEnquiries();
      
      if (!(response as any)?.success || !Array.isArray((response as any).data?.enquiries)) {
        return [];
      }

      const enquiries = (response as any).data.enquiries;
      const students: StudentItem[] = enquiries.map((enquiry: any, idx: number) => ({
        date: new Date(enquiry.createdAt || Date.now() - idx * 86400000).toLocaleDateString('en-GB'),
        name: enquiry.studentName || `student ${idx + 1}`,
        studentId: String(enquiry._id || idx),
        status: enquiry.enquiryType || "Requested for callback",
        programInterests: [enquiry.programInterest || "General Interest"],
        email: enquiry.studentEmail,
        phone: enquiry.studentPhone,
        timestampMs: new Date(enquiry.createdAt || Date.now()).getTime(),
        institutionId: institution._id,
        lastUpdated: Date.now()
      }));

      // Save to cache
      await saveStudents(students);
      
      return students.slice(0, 4);
    },
    enabled: !!institution?._id,
    staleTime: CACHE_DURATION.STUDENTS,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes when active
  });
}

// Chart data hook
export function useChartData(type: 'views' | 'comparisons' | 'leads' = 'views', year?: number) {
  const { data: institution } = useInstitution();
  const currentYear = year || new Date().getFullYear();
  
  return useQuery({
    queryKey: QUERY_KEYS.CHART_DATA(type, currentYear, institution?._id),
    queryFn: async (): Promise<number[]> => {
      if (!institution?._id) {
        throw new Error('Institution not available');
      }

      // Try cache first
      const cached = await getChartData(type, currentYear, institution._id);
      if (cached && Date.now() - cached.lastUpdated < CACHE_DURATION.CHART) {
        return cached.series;
      }

      // Fetch from API
      const response = await metricsAPI.getInstitutionAdminSeries(type, currentYear, institution._id);
      
      if (!(response as any)?.success || !Array.isArray((response as any).data?.series)) {
        return new Array(12).fill(0);
      }

      const series = (response as any).data.series as number[];
      const chartSeries = new Array(12).fill(0);
      series.forEach((count, monthIdx) => {
        if (monthIdx >= 0 && monthIdx < 12) {
          chartSeries[monthIdx] = count || 0;
        }
      });

      // Save to cache
      await saveChartData({
        type,
        year: currentYear,
        series: chartSeries,
        institutionId: institution._id,
        lastUpdated: Date.now()
      });
      
      return chartSeries;
    },
    enabled: !!institution?._id,
    staleTime: CACHE_DURATION.CHART,
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes when active
  });
}

// Infinite leads hook
export function useInfiniteLeads(pageSize: number = 10) {
  const { data: institution } = useInstitution();
  return useInfiniteQuery({
    queryKey: ['leads-infinite', institution?._id, pageSize],
    enabled: !!institution?._id,
    initialPageParam: 0,
    getNextPageParam: (lastPage: any[], allPages, lastPageParam: number) => {
      if (!lastPage || lastPage.length < pageSize) return undefined;
      return lastPageParam + 1;
    },
    queryFn: async ({ pageParam }) => {
      const pageIndex = pageParam as number;
      // Page 0: IndexedDB first, warm from API if empty and persist top 10 only
      if (pageIndex === 0) {
        let rows = await getDashboardStudentsPage(institution?._id, 0, pageSize);
        if (!rows || rows.length === 0) {
          try {
            const response = await enquiriesAPI.getRecentEnquiries();
            if ((response as any)?.success && Array.isArray((response as any).data?.enquiries)) {
              const enquiries = (response as any).data.enquiries;
              const students: StudentItem[] = enquiries.map((enquiry: any, idx: number) => ({
                date: new Date(enquiry.createdAt || Date.now() - idx * 86400000).toLocaleDateString('en-GB'),
                name: enquiry.studentName || `student ${idx + 1}`,
                studentId: String(enquiry._id || idx),
                status: enquiry.enquiryType || 'Requested for callback',
                programInterests: [enquiry.programInterest || 'General Interest'],
                email: enquiry.studentEmail,
                phone: enquiry.studentPhone,
                timestampMs: new Date(enquiry.createdAt || Date.now()).getTime(),
                institutionId: institution?._id,
                lastUpdated: Date.now()
              }));
              await replaceDashboardStudentsWithLatestTen(students as any);
              rows = await getDashboardStudentsPage(institution?._id, 0, pageSize);
            }
          } catch {}
        }
        return rows as any[];
      }
      // Page > 0: API only with offset; do not persist in IndexedDB
      const offset = pageIndex * pageSize;
      const response = await enquiriesAPI.getRecentEnquiriesWithOffset(offset, pageSize) as any;
      const list = (response?.data?.enquiries || []) as any[];
      const mapped = list.map((enquiry: any, idx: number) => ({
        date: new Date(enquiry.createdAt || Date.now() - idx * 86400000).toLocaleDateString('en-GB'),
        name: enquiry.studentName || `student ${idx + 1}`,
        studentId: String(enquiry._id || idx),
        status: enquiry.enquiryType || 'Requested for callback',
        programInterests: [enquiry.programInterest || 'General Interest'],
        email: enquiry.studentEmail,
        phone: enquiry.studentPhone,
        timestampMs: new Date(enquiry.createdAt || Date.now()).getTime(),
        institutionId: institution?._id,
        lastUpdated: Date.now()
      }));
      return mapped as any[];
    }
  });
}

export async function appendNewLeadToCache(newLead: StudentItem) {
  await prependAndTrimDashboardStudents([newLead as any]);
}

// Mutation for refreshing all data
export function useRefreshDashboard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // Invalidate all queries to force refresh
      await queryClient.invalidateQueries();
      return true;
    },
    onSuccess: () => {
      console.log('Dashboard data refreshed');
    },
    onError: (error) => {
      console.error('Failed to refresh dashboard:', error);
    }
  });
}

// Hook for offline status
export function useOnlineStatus() {
  return useQuery({
    queryKey: ['online-status'],
    queryFn: () => navigator.onLine,
    staleTime: 0,
    refetchInterval: 5000, // Check every 5 seconds
    refetchIntervalInBackground: true,
  });
} 