import { StoreHeader } from "@/components/store-header";

export const StoreLoadingState = () => {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <StoreHeader />
        <div className="text-center py-12">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="mt-2 text-muted-foreground">
            Loading products from Stripe...
          </p>
        </div>
      </div>
    </div>
  );
};
