import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-lg animate-shimmer", className)}
    />
  );
}

export function HotelCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="w-full sm:w-64 h-48 rounded-none" />
        <div className="flex-1 p-4 sm:p-5 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <div className="flex items-center justify-between pt-3">
            <Skeleton className="h-5 w-16 rounded" />
            <div className="text-right space-y-1">
              <Skeleton className="h-3 w-10 ml-auto" />
              <Skeleton className="h-7 w-20 ml-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
