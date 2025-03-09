import { Skeleton } from "@/components/ui/skeleton";

export function MediaDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      {/* Breadcrumb skeleton */}
      <div className="mb-6">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Title and metadata skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-2/3 mb-2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Media content skeleton - Left column */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="rounded-xl overflow-hidden shadow-md border border-border">
            <Skeleton className="w-full aspect-video" />
          </div>

          {/* Description skeleton */}
          <div className="mt-6 p-6 rounded-xl bg-card border border-border">
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>

        {/* Metadata skeleton - Right column */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="p-6 rounded-xl bg-card border border-border">
            <Skeleton className="h-6 w-40 mb-4" />

            <div className="space-y-4">
              {/* File size skeleton */}
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5" />
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              {/* Duration skeleton */}
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5" />
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              {/* Format skeleton */}
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5" />
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              {/* Date skeleton */}
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5" />
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Views skeleton */}
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5" />
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              {/* Tags skeleton */}
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5" />
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-14" />
                  </div>
                </div>
              </div>
            </div>

            {/* Download button skeleton */}
            <Skeleton className="w-full h-10 mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
