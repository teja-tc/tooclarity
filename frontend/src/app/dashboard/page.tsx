"use client";

import { useAuth, withAuth } from "../../lib/auth-context";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/Topbar";
import SettingsPage from "@/components/dashboard/settings";
import SubscriptionGauge from "@/components/dashboard/subscription";

// import DashboardStats from "@/components/dashboard/DashboardStats";
// import AdCard from "@/components/dashboard/AdCard";
// import CustomerList, { CustomerItem } from "@/components/dashboard/CustomerList";
// import SubscriptionGauge from "@/components/dashboard/SubscriptionGauge";
// import CourseReachChart from "@/components/dashboard/CourseReachChart";
// import { getMyInstitution, getInstitutionBranches, getInstitutionCourses, authAPI } from "@/lib/api";

// Types for dynamic data
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
  timeRange: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

function DashboardPage() {
  const { user, logout } = useAuth();
  
  // Dynamic state management
  const [stats, setStats] = useState<DashboardStatsData>({
    courseViews: 0,
    courseComparisons: 0,
    contactRequests: 0,
    courseViewsTrend: { value: 0, isPositive: true },
    courseComparisonsTrend: { value: 0, isPositive: true },
    contactRequestsTrend: { value: 0, isPositive: true }
  });

  const [filters, setFilters] = useState<FilterState>({
    course: "All Courses",
    timeRange: "Weekly"
  });

  // const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionDays, setSubscriptionDays] = useState(0);
  const [activeSidebarItem, setActiveSidebarItem] = useState(0);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [chartValues, setChartValues] = useState<number[] | null>(null);
  const [profileName, setProfileName] = useState<string | undefined>(undefined);
  const [institutionCreatedAt, setInstitutionCreatedAt] = useState<string | null>(null);

  // Poll backend to keep subscriptionDays in sync (real-time) without UI changes
  useEffect(() => {
    if (!institutionId) return;
    const interval = setInterval(async () => {
      try {
        // Recompute days left from institution createdAt to avoid placeholder logic
        if (institutionCreatedAt) {
          const created = new Date(institutionCreatedAt);
          const now = new Date();
          const diffMs = now.getTime() - created.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const daysLeftCalc = Math.max(0, 30 - diffDays);
          setSubscriptionDays(daysLeftCalc);
        } else {
          // Fallback: use courses length if createdAt not known
          // const courses = await getInstitutionCourses(institutionId);
          // if (Array.isArray(courses)) {
          //   setSubscriptionDays(Math.max(0, 30 - (courses.length % 30)));
          // }
        }
      } catch {}
    }, 10000); // every 10s
    return () => clearInterval(interval);
  }, [institutionId, institutionCreatedAt]);

  // Generate fallback customer data (will be replaced by branches once loaded)
  const generateCustomers = useCallback(() => {
    const names = [
      "Raghavendar Reddy", "Sarah Johnson", "Michael Chen", "Emily Davis",
      "David Wilson", "Lisa Anderson", "James Brown", "Maria Garcia",
      "Robert Taylor", "Jennifer Martinez", "William Jones", "Ashley White"
    ];
    const statuses = [
      "Requested for call back", "Requested for demo", "Interested in pricing",
      "Follow up needed", "Hot lead", "Qualified prospect", "Demo scheduled"
    ];
    // const newCustomers: CustomerItem[] = Array.from({ length: 8 }, (_, i) => ({
    //   date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
    //   name: names[Math.floor(Math.random() * names.length)],
    //   id: (181200 + i).toString(),
    //   status: statuses[Math.floor(Math.random() * statuses.length)]
    // }));
    // setCustomers(newCustomers);
  }, []);

  // Fetch institution, profile and related data
  // useEffect(() => {
  //   let mounted = true;
  //   async function fetchData() {
  //     try {
  //       // Profile for Topbar
  //       const profile = await authAPI.getProfile();
  //       if ((profile as any)?.data?.name && mounted) {
  //         setProfileName((profile as any).data.name);
  //       }

  //       const inst = await getMyInstitution();
  //       if (!mounted || !inst?._id) {
  //         setIsLoading(false);
  //         return;
  //       }
  //       setInstitutionId(inst._id);
  //       // Capture createdAt for production-safe subscription calc
  //       if (inst?.createdAt) setInstitutionCreatedAt(inst.createdAt);

  //       const [branches, courses] = await Promise.all([
  //         getInstitutionBranches(inst._id),
  //         getInstitutionCourses(inst._id)
  //       ]);

  //       // Map branches to customer list entries
  //       if (Array.isArray(branches)) {
  //         const mapped: CustomerItem[] = branches
  //           .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  //           .slice(0, 8)
  //           .map((b: any, idx: number) => ({
  //             date: new Date(b.createdAt || Date.now() - idx * 86400000).toLocaleDateString('en-GB'),
  //             name: b.branchName || Branch ${idx + 1},
  //             id: String(b._id || idx),
  //             status: b.contactInfo ? "Requested for call back" : "Interested in pricing"
  //           }));
  //         setCustomers(mapped);
  //       }

        // Build a 12-month series from course createdAt timestamps
  //       if (Array.isArray(courses)) {
  //         const arr = new Array(12).fill(0);
  //         courses.forEach((c: any) => {
  //           const d = new Date(c.createdAt || Date.now());
  //           const m = d.getMonth();
  //           arr[m] += 1;
  //         });
  //         const scaled = arr.map(v => v * 20); // keep visual scale
  //         setChartValues(scaled);
  //       }

  //       // Production-safe stats without arbitrary multipliers
  //       const courseCount = Array.isArray(courses) ? courses.length : 0;
  //       const branchCount = Array.isArray(branches) ? branches.length : 0;
  //       const comparisonCount = Array.isArray(courses)
  //         ? new Set(courses.map((c: any) => ${c.streamType || ''}|${c.graduationType || ''})).size
  //         : 0;

  //       setStats({
  //         courseViews: courseCount,
  //         courseComparisons: comparisonCount,
  //         contactRequests: branchCount,
  //         courseViewsTrend: { value: 0, isPositive: true },
  //         courseComparisonsTrend: { value: 0, isPositive: true },
  //         contactRequestsTrend: { value: 0, isPositive: true },
  //       });

  //       // Derive subscription days from institution.createdAt when available
  //       if (inst?.createdAt) {
  //         const created = new Date(inst.createdAt);
  //         const now = new Date();
  //         const diffMs = now.getTime() - created.getTime();
  //         const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  //         const daysLeftCalc = Math.max(0, 30 - diffDays);
  //         setSubscriptionDays(daysLeftCalc);
  //       } else if (Array.isArray(courses)) {
  //         setSubscriptionDays(Math.max(0, 30 - (courses.length % 30)));
  //       }

  //       setIsLoading(false);
  //     } catch (err) {
  //       console.error('Failed to fetch backend data:', err);
  //       // Fallback customers if needed
  //       generateCustomers();
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchData();
  //   return () => { mounted = false; };
  // }, [generateCustomers]);

  // Filter change handler (reserved for future backend filtering)
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex gap-0">
        <Sidebar 
          activeItem={activeSidebarItem} 
          onItemClick={setActiveSidebarItem}
        />
        <motion.main 
  className="flex-1 max-w-[1400px] mr-5 px-4 lg:px-6 ml-0 h-[100dvh] overflow-y-auto scrollbar-hide"
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  <Topbar 
    userName={profileName || user?.name || user?.admin} 
    onSearch={(query) => console.log('Search:', query)}
    onNotificationClick={() => console.log('Notifications clicked')}
    onProfileClick={() => console.log('Profile clicked')}
  />

  {/* Added consistent margin-top for sections below Topbar */}
  <div className="mt-6">
    {activeSidebarItem === 0 && (
      <>
        {/* Top Row: Dashboard Stats + Ad Card */}
        <motion.div 
          className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6 p-2 rounded-2xl"
          variants={itemVariants}
        >
          <div className="xl:col-span-2 bg-gray-50 rounded-2xl p-6">
            {/* <DashboardStats
              stats={stats}
              filters={filters}
              isLoading={isLoading}
              onFilterChange={handleFilterChange}
            /> */}
          </div>
          <div className="xl:col-span-1 bg-gray-50 rounded-2xl p-6">
            {/* <AdCard onShare={(platform) => console.log('Share to:', platform)} /> */}
          </div>
        </motion.div>

        {/* Middle: customer list + subscription */}
        <motion.div 
          className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6"
          variants={itemVariants}
        >
          <div className="xl:col-span-2 bg-gray-50 rounded-2xl p-6">
            {/* <CustomerList ... /> */}
          </div>
          <div className="xl:col-span-1 bg-gray-50 rounded-2xl p-6">
            {/* <SubscriptionGauge ... /> */}
          </div>
        </motion.div>
      </>
    )}

    {activeSidebarItem === 3 && (
      <motion.div 
        className="grid grid-cols-1 gap-6 mb-6 p-2 mt-6 rounded-2xl"
        variants={itemVariants}
      >
        <div className="bg-gray-50 rounded-2xl p-6">
          <SubscriptionGauge 
            // daysLeft={Math.floor(subscriptionDays)} 
            // onUpgrade={() => console.log('Upgrade clicked')}
          />
        </div>
      </motion.div>
    )}

    {activeSidebarItem === 4 && (
      <motion.div 
        className="grid grid-cols-1 gap-6 mb-6 p-2 mt-6 rounded-2xl"
        variants={itemVariants}
      >
        <div className="bg-gray-50 rounded-2xl p-6">
          <SettingsPage />
        </div>
      </motion.div>
    )}
  </div>
</motion.main>

      </div>
    </div>
  );
}

export default withAuth(DashboardPage);