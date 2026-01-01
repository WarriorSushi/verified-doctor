import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-4 sm:space-y-8 animate-pulse">
      {/* Verification Banner Skeleton */}
      <Skeleton className="h-20 rounded-xl" />

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 sm:h-32 rounded-xl" />
        ))}
      </div>

      {/* QR Code & Quick Actions Skeleton */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>

      {/* Profile URL Skeleton */}
      <Skeleton className="h-24 rounded-xl" />
    </div>
  );
}
