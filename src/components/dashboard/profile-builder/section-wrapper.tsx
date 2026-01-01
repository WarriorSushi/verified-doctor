"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

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
    <div className={cn(
      "bg-white rounded-xl border transition-all",
      isVisible ? "border-slate-200 shadow-sm" : "border-slate-200"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {/* Left side - clickable to expand */}
        <div
          className="flex items-center gap-3 flex-1 cursor-pointer select-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
            isVisible ? "bg-[#0099F7]/10 text-[#0099F7]" : "bg-slate-100 text-slate-400"
          )}>
            {icon}
          </div>
          <div className={cn(
            "transition-opacity",
            isVisible ? "opacity-100" : "opacity-50"
          )}>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">{title}</h3>
              {badge && (
                <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 rounded-full">
                  {badge}
                </span>
              )}
              {!isVisible && (
                <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full">
                  Hidden on profile
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-slate-500">{description}</p>
            )}
          </div>
        </div>

        {/* Right side - controls */}
        <div className="flex items-center gap-3">
          {/* Visibility Toggle - always prominent */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {isVisible ? (
              <Eye className="w-4 h-4 text-[#0099F7]" />
            ) : (
              <EyeOff className="w-4 h-4 text-slate-500" />
            )}
            <span className="text-xs font-medium text-slate-700">
              {isVisible ? "Visible" : "Hidden"}
            </span>
            <Switch
              checked={isVisible}
              onCheckedChange={onVisibilityChange}
              className="data-[state=checked]:bg-[#0099F7]"
            />
          </div>

          {/* Expand/Collapse */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className={cn(
          "px-4 pb-4 border-t border-slate-100 pt-4",
          !isVisible && "opacity-50"
        )}>
          {children}
        </div>
      )}
    </div>
  );
}
