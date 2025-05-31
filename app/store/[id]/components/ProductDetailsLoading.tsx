export const ProductDetailsLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted animate-pulse" />

      <div className="space-y-6">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />

        <div className="space-y-2">
          <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
        </div>

        <div className="flex gap-2">
          <div className="h-6 w-16 bg-muted rounded animate-pulse" />
          <div className="h-6 w-20 bg-muted rounded animate-pulse" />
        </div>

        <div className="pt-6 border-t border-red-500/20">
          <div className="h-8 w-24 bg-muted rounded animate-pulse mb-4" />
          <div className="h-12 w-full bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};
