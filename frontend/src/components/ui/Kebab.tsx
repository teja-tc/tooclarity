import React from "react";
import { motion } from "framer-motion";

interface KebabProps {
  onClick?: () => void;
  className?: string;
  size?: number; // pixel size of each dot
  gap?: number;  // pixel gap between dots
  colorClass?: string; // tailwind text color class
}

const Kebab: React.FC<KebabProps> = ({ onClick, className = "", size = 4, gap = 3, colorClass = "text-gray-400" }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex flex-col items-center justify-center ${colorClass} ${className}`}
      aria-label="More options"
    >
      <span style={{ width: size, height: size }} className="rounded-full bg-current block" />
      <span style={{ height: gap }} className="block" />
      <span style={{ width: size, height: size }} className="rounded-full bg-current block" />
      <span style={{ height: gap }} className="block" />
      <span style={{ width: size, height: size }} className="rounded-full bg-current block" />
    </motion.button>
  );
};

export default Kebab; 