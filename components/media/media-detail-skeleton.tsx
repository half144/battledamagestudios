import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MediaDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button
          variant="link"
          asChild
          className="p-0 h-auto text-muted-foreground hover:text-primary"
        >
          <Link href="/Media" className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Media Library
          </Link>
        </Button>
      </div>

      {/* Title and metadata skeleton */}
      <div className="mb-8">
        <div className="h-8 w-1/2 bg-primary/10 rounded animate-pulse mb-2"></div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="h-5 w-20 bg-muted/50 animate-pulse"
          ></Badge>
          <span>•</span>
          <div className="h-4 w-24 bg-muted/50 rounded animate-pulse"></div>
          <span>•</span>
          <div className="h-4 w-16 bg-muted/50 rounded animate-pulse"></div>
          <span>•</span>
          <div className="h-4 w-20 bg-muted/50 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Media content skeleton - Left column */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="rounded-xl overflow-hidden shadow-md border border-border">
            <div className="w-full aspect-video bg-black/5 animate-pulse flex items-center justify-center">
              <svg
                className="w-16 h-16 text-muted/30"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 15h18" />
              </svg>
            </div>
          </div>

          {/* Description skeleton */}
          <div className="mt-6 p-6 rounded-xl bg-card border border-border">
            <div className="h-5 w-1/3 bg-primary/10 rounded mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-muted/50 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-muted/50 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-muted/50 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Metadata skeleton - Right column */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="h-5 w-1/2 bg-primary/10 rounded mb-6 animate-pulse"></div>
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-5 w-5 bg-muted/50 rounded-full mt-0.5 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-1/3 bg-muted/50 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 w-1/2 bg-muted/50 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-10 w-full bg-primary/20 rounded mt-6 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
