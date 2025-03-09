import { Skeleton } from "@/components/ui/skeleton";

export function MediaListSkeleton() {
  return (
    <>
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-5 w-2/3" />
      </div>

      {/* Filter Section skeleton */}
      <div className="mb-8 space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20" />
          ))}
        </div>
      </div>

      {/* Results count skeleton */}
      <div className="mb-4">
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Media Grid skeleton */}
      {Array.from({ length: 2 }).map((_, gameIndex) => (
        <div key={gameIndex} className="mb-12">
          {/* Game title skeleton */}
          <Skeleton className="h-8 w-48 mb-6" />

          {/* Media cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="rounded-xl border border-border overflow-hidden bg-card"
              >
                {/* Thumbnail skeleton */}
                <Skeleton className="w-full aspect-video" />

                {/* Card content */}
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
