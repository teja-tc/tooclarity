"use client";

import { motion } from "framer-motion";
import { JSX } from "react";

interface ScrollingBoxContainerProps {
  direction?: "up" | "down";
  boxes: { id: number; component: JSX.Element }[];
}

export default function ScrollingBoxContainer({ direction = "up", boxes }: ScrollingBoxContainerProps) {
  return (
    <div className="relative h-[400px] overflow-hidden">
      <motion.div
        className="flex flex-col gap-4"
        initial={{ y: direction === "up" ? 0 : -400 }}
        animate={{ y: direction === "up" ? -400 : 0 }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 15,
          ease: "linear",
        }}
      >
        {/* Duplicate list to achieve seamless infinite scroll */}
        {[...boxes, ...boxes].map((box, index) => (
          <div key={`${box.id}-${index}`} className="flex-shrink-0">
            {box.component}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
