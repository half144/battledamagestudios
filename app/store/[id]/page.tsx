"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { StoreProduct } from "@/types/store-item";
import { fetchProductByIdPublicApi } from "@/lib/storeApi";

export default function ProductDetails() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addItem);
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product from Supabase (public API)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchProductByIdPublicApi(id);
        setProduct(data);
      } catch (error) {
        console.error("Error loading product:", error);
        setError("Error loading product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="mt-2 text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <p className="text-muted-foreground mb-4">
              {error || "The requested product does not exist."}
            </p>
            <Button onClick={() => router.push("/store")}>Back to Store</Button>
          </div>
        </div>
      </div>
    );
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-red-500/10 to-purple-500/10">
            <Image
              src={product.image_url || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <Link
              href="/store"
              className="inline-flex items-center text-muted-foreground hover:text-red-500 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Link>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold">{product.name}</h1>
                {product.active && (
                  <Badge className="bg-green-500">Active</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-red-500 text-red-500" />
                  <span className="ml-1 text-lg font-medium">4.5</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {product.category}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.active && <Badge variant="secondary">Available</Badge>}
              </div>
            </div>

            {/* Download link if file_url exists */}
            {product.file_url && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  File available:
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(product.file_url, "_blank")}
                >
                  Download File
                </Button>
              </div>
            )}

            <div className="pt-6 border-t border-red-500/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold">
                  {formatPrice(product.price)}
                </span>
              </div>
              <Button
                size="lg"
                className="w-full bg-red-500 hover:bg-red-600"
                disabled={!product.active}
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image_url,
                  })
                }
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.active ? "Add to Cart" : "Product Unavailable"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
