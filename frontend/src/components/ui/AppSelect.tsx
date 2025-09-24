import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type SelectOption = string | { label: string; value: string };

interface AppSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  variant?: "gray" | "blue" | "white";
  size?: "sm" | "md";
  rounded?: "full" | "lg";
  stopPropagation?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const AppSelect: React.FC<AppSelectProps> = ({
  value,
  onChange,
  options,
  className = "",
  variant = "gray",
  size = "md",
  rounded = "lg",
  stopPropagation = false,
  placeholder,
  disabled
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [highlightIdx, setHighlightIdx] = useState<number>(-1);

  const normalized = useMemo(() => (
    options.map(opt => typeof opt === "string" ? { label: opt, value: opt } : opt)
  ), [options]);

  const current = normalized.find(o => o.value === value);

  // Styling presets with dark mode support
  const variantClasses = variant === "blue"
    ? "bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 focus:ring-2 focus:ring-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/40 dark:hover:bg-blue-900/30 dark:focus:ring-blue-700/40"
    : variant === "white"
      ? "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700/80 dark:focus:ring-gray-600/40"
      : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-600/40";

  const sizeClasses = size === "sm" ? "px-3 py-1 text-xs h-8" : "px-4 py-2 text-sm h-10";
  const roundedClasses = rounded === "full" ? "rounded-full" : "rounded-lg";

  const buttonClasses = `${variantClasses} ${sizeClasses} ${roundedClasses} inline-flex items-center justify-between gap-2 w-full`;

  const handleClickContainer: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (stopPropagation) e.stopPropagation();
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      setHighlightIdx(Math.max(0, normalized.findIndex(o => o.value === value)));
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx(idx => Math.min(normalized.length - 1, (idx < 0 ? 0 : idx + 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx(idx => Math.max(0, (idx < 0 ? 0 : idx - 1)));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sel = normalized[highlightIdx];
      if (sel) {
        onChange(sel.value);
        setOpen(false);
        buttonRef.current?.focus();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef} className={`relative inline-block min-w-[8rem] ${className}`} onClick={handleClickContainer}>
      <button
        ref={buttonRef}
        type="button"
        className={buttonClasses}
        onClick={() => setOpen(o => !o)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate text-left flex-1">
          {current ? current.label : (placeholder || "Select")}
        </span>
        <span className="text-current">▾</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-30 mt-1 w-full ${rounded === "full" ? "rounded-xl" : "rounded-lg"} border bg-white shadow-lg overflow-auto max-h-60 dark:bg-gray-800 dark:border-gray-700`}
          >
            {normalized.map((o, idx) => {
              const active = value === o.value;
              const highlighted = idx === highlightIdx;
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={active}
                  className={`px-3 py-2 text-sm cursor-pointer select-none ${
                    highlighted
                      ? "bg-gray-100 dark:bg-gray-700"
                      : active
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  }`}
                  onMouseEnter={() => setHighlightIdx(idx)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { onChange(o.value); setOpen(false); }}
                >
                  {o.label}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppSelect; 