"use client";

import { useState } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SectionWrapperProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

export function SectionWrapper({
  title,
  description,
  icon,
  isVisible,
  onVisibilityChange,
  children,
  defaultOpen = false,
  badge,
}: SectionWrapperProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border-2 transition-all duration-200",
        isVisible
          ? "border-slate-200/80 shadow-sm"
          : "border-dashed border-slate-200"
      )}
    >
      {/* Header - Mobile optimized */}
      <div className="p-4 sm:p-5">
        {/* Top row: Icon, Title, and Visibility Toggle */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              "w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200",
              isVisible
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-400"
            )}
          >
            {icon}
          </div>

          {/* Title & Description */}
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={cn(
                  "font-semibold text-base sm:text-lg transition-colors",
                  isVisible ? "text-slate-900" : "text-slate-500"
                )}
              >
                {title}
              </h3>
              {badge && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 rounded-md uppercase tracking-wide">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p
                className={cn(
                  "text-sm mt-0.5 transition-colors line-clamp-2",
                  isVisible ? "text-slate-500" : "text-slate-400"
                )}
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Controls row - Better mobile layout */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          {/* Visibility Toggle - Large touch target */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onVisibilityChange(!isVisible);
            }}
            className={cn(
              "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]",
              isVisible
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            )}
          >
            {isVisible ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Visible on profile</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Hidden from profile</span>
              </>
            )}
          </button>

          {/* Expand/Collapse - Large touch target */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]",
              "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <span>{isOpen ? "Collapse" : "Edit"}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {/* Content with animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "px-4 sm:px-5 pb-5 pt-4 border-t border-slate-100",
                !isVisible && "opacity-60"
              )}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
