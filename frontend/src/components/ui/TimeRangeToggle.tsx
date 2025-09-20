import React from "react";
import { Button } from "./button";

export type TimeRangeValue = "Weekly" | "Monthly" | "Yearly" | 'weekly' | 'monthly' | 'yearly';

interface TimeRangeToggleProps {
  value: TimeRangeValue;
  onChange: (value: TimeRangeValue) => void;
  className?: string;
  size?: "sm" | "md";
  rounded?: "sm" | "lg";
}

const TimeRangeToggle: React.FC<TimeRangeToggleProps> = ({ value, onChange, className = "", size = "sm", rounded = "lg" }) => {
  const ranges: ("Weekly"|"Monthly"|"Yearly")[] = ["Weekly", "Monthly", "Yearly"];
  const sizeClass = size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-2";
  const roundedClass = rounded === "sm" ? "rounded-sm" : "rounded-lg";

  const isActive = (r: string) => (value || "Weekly").toString().toLowerCase() === r.toLowerCase();

  return (
    <div className={`flex items-center gap-1 border border-gray-200 dark:border-gray-700 ${roundedClass} p-1 bg-white dark:bg-gray-800 ${className}`}>
      {ranges.map(r => (
        <Button
          key={r}
          variant="ghost"
          size="sm"
          aria-pressed={isActive(r)}
          onClick={() => onChange(r)}
          className={`${roundedClass} ${sizeClass} ${isActive(r) ? 'bg-indigo-100 text-gray-900 hover:bg-indigo-100' : 'text-gray-900 dark:text-gray-100'}`}
        >
          {r}
        </Button>
      ))}
    </div>
  );
};

export default TimeRangeToggle; 