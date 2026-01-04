"use client";

import { Skeleton } from "@/components/ui/skeleton";

function SectionSkeleton({ hasContent = true }: { hasContent?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {/* Icon skeleton */}
          <Skeleton className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex-shrink-0" />

          {/* Title & Description */}
          <div className="flex-1 min-w-0 pt-0.5 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32 sm:w-40" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48 sm:w-64" />
          </div>

          {/* Toggle skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-12 rounded-full" />
            <Skeleton className="h-4 w-24 hidden sm:block" />
          </div>
        </div>

        {/* Expand/collapse button skeleton */}
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>

      {/* Content area (occasionally shown) */}
      {hasContent && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}

export default function ProfileBuilderLoading() {
  return (
    <div className="space-y-5 sm:space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Section Skeletons - matching the actual sections */}
      <SectionSkeleton hasContent={true} />  {/* Video Introduction */}
      <SectionSkeleton hasContent={true} />  {/* Approach to Care */}
      <SectionSkeleton hasContent={false} /> {/* Qualifications */}
      <SectionSkeleton hasContent={false} /> {/* Hospital Affiliations */}
      <SectionSkeleton hasContent={false} /> {/* Conditions & Procedures */}
      <SectionSkeleton hasContent={true} />  {/* First Visit Guide */}
      <SectionSkeleton hasContent={false} /> {/* Availability */}
      <SectionSkeleton hasContent={false} /> {/* Case Studies */}

      {/* Save Button Skeleton */}
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
