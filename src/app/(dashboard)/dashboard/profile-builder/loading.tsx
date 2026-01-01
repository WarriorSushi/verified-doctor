import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileBuilderLoading() {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Section Skeletons */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>

      {/* Save Button Skeleton */}
      <Skeleton className="h-12 rounded-xl" />
    </div>
  );
}
