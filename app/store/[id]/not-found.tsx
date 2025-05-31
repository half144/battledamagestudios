import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center py-12">
          <div className="mb-6">
            <Package className="w-16 h-16 mx-auto text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            The product you're looking for doesn't exist or has been removed
            from our store.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/store">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Store
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
