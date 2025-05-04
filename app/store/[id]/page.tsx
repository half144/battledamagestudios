"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { storeItems } from "@/data/store";

export default function ProductDetails() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addItem);
  const params = useParams();
  const id = params.id as string;
  const item = storeItems.find((item) => item.id === parseInt(id));

  if (!item) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

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
              src={item.image}
              alt={item.name}
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
                <h1 className="text-4xl font-bold">{item.name}</h1>
                {item.featured && (
                  <Badge className="bg-red-500">Featured</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-red-500 text-red-500" />
                  <span className="ml-1 text-lg font-medium">
                    {item.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{item.category}</span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-red-500/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold">${item.price}</span>
              </div>
              <Button
                size="lg"
                className="w-full bg-red-500 hover:bg-red-600"
                onClick={() =>
                  addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                  })
                }
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
