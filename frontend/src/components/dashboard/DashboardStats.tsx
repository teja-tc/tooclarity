import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatCard from "./StatCard";
import TimeRangeToggle, { TimeRangeValue } from "../ui/TimeRangeToggle";
import { metricsAPI } from "@/lib/api";

// Types for dynamic data
interface DashboardStats {
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

interface DashboardStatsProps {
  stats: DashboardStats;
  filters: FilterState;
  isLoading: boolean;
  onFilterChange: (filters: FilterState) => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  filters,
  isLoading,
  onFilterChange
}) => {
  const handleTimeRangeFilter = (timeRange: TimeRangeValue) => {
    onFilterChange({ ...filters, timeRange: timeRange.toLowerCase() as 'weekly' | 'monthly' | 'yearly' });
  };

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

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  const [baseline, setBaseline] = useState<number>(stats.courseViews);

  useEffect(() => {
    // fetch institutionAdmin range value on range change
    const fetchRange = async () => {
      try {
        const range = (filters.timeRange || 'Weekly').toString().toLowerCase() as 'weekly'|'monthly'|'yearly';
        const res = await metricsAPI.getInstitutionAdminByRange('views', range);
        if ((res as any)?.success) {
          const total = (res as any).data?.totalViews ?? 0;
          // compute trend vs previous baseline for this range
          const delta = baseline > 0 ? Math.round(((total - baseline) / baseline) * 100) : (total > 0 ? 100 : 0);
          const isPositive = total - baseline >= 0;
          // Update baseline for next comparison
          setBaseline(total);
        }
      } catch (err) {
        console.error('DashboardStats: institutionAdmin range fetch failed', err);
      }
    };
    fetchRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.timeRange]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full"
    >
      {/* Header with Time Range Toggle */}
      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2 mb-4 sm:mb-6 m-3 sm:m-5"
        variants={headerVariants}
      >
        <div className="text-lg sm:text-sm md:text-2xl font-semibold">Dashboard</div>
        <div className="ml-0 sm:ml-auto flex items-center gap-2 w-full sm:w-auto">
          <TimeRangeToggle
            value={(filters.timeRange as TimeRangeValue) || "Weekly"}
            onChange={handleTimeRangeFilter}
          />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-3 sm:px-0"
        variants={statsVariants}
      >
        <AnimatePresence mode="wait">
          <StatCard
            key={`views-${stats.courseViews}-${filters.timeRange}`}
            title={
              <div className="text-left">
                <div className="hidden sm:block">
                  <div>Program</div>
                  <div>Views</div>
                </div>
                <div className="block sm:hidden">Program Views</div>
              </div>
            }
            value={stats.courseViews}
            trend={stats.courseViewsTrend}
            isLoading={isLoading}
            showFilters={false}
          />
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <StatCard
            key={`appearances-${stats.courseComparisons}-${filters.timeRange}`}
            title={
              <div className="text-left">
                <div className="hidden sm:block">
                  <div>Comparison</div>
                  <div>Appearances</div>
                </div>
                <div className="block sm:hidden">Comparison Appearances</div>
              </div>
            }
            value={stats.courseComparisons}
            trend={stats.courseComparisonsTrend}
            isLoading={isLoading}
            showFilters={false}
          />
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <StatCard
            key={`leads-${stats.contactRequests}-${filters.timeRange}`}
            title={
              <div className="text-left">
                <div className="hidden sm:block">
                  <div>Leads</div>
                  <div>Generated</div>
                </div>
                <div className="block sm:hidden">Leads Generated</div>
              </div>
            }
            value={stats.contactRequests}
            trend={stats.contactRequestsTrend}
            isLoading={isLoading}
            showFilters={false}
          />
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default DashboardStats; 