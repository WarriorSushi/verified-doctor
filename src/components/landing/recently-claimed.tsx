"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const recentHandles = [
  "priya",
  "sharma",
  "patel",
  "gupta",
  "mehta",
  "reddy",
  "khan",
  "singh",
  "kumar",
  "das",
];

export function RecentlyClaimed() {
  // Initialize with first 3 handles
  const [displayedHandles, setDisplayedHandles] = useState<string[]>(
    recentHandles.slice(0, 3)
  );
  const indexRef = useRef(3);

  // Cycle through handles
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = indexRef.current % recentHandles.length;
      indexRef.current = indexRef.current + 1;

      setDisplayedHandles((prev) => {
        const newHandles = [...prev.slice(1), recentHandles[nextIndex]];
        return newHandles;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="py-4 sm:py-6"
    >
      <div className="max-w-xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="text-base">🔥</span>
            <span className="font-medium text-slate-600">Recently claimed:</span>
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
            <AnimatePresence mode="popLayout">
              {displayedHandles.map((handle, index) => (
                <motion.span
                  key={`${handle}-${index}`}
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium whitespace-nowrap"
                >
                  <span className="text-slate-400 mr-0.5">/</span>
                  {handle}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
