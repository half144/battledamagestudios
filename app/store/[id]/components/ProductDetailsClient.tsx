"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { motion } from "framer-motion";
import Link from "next/link";
import { StripeProduct } from "@/types/stripe";
import { getProductPrice, getProductCategory } from "@/utils/productFilters";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductDetailsClientProps {
  product: StripeProduct;
}

export const ProductDetailsClient = ({
  product,
}: ProductDetailsClientProps) => {
  const addToCart = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useAuthStatus();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const productPrice = getProductPrice(product);
  const productCategory = getProductCategory(product);
  const productImage =
    product.images.length > 0 ? product.images[0] : "/images/placeholder.jpg";

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to add items to cart");
      router.push("/login");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: productPrice,
      image: productImage,
    });

    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-red-500/10 to-purple-500/10">
        <Image
          src={productImage}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
      </div>

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
            {product.active && <Badge className="bg-green-500">Active</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="w-5 h-5 fill-red-500 text-red-500" />
              <span className="ml-1 text-lg font-medium">4.5</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{productCategory}</span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-lg text-muted-foreground">
            {product.description || "No description available."}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{productCategory}</Badge>
            {product.active && <Badge variant="secondary">Available</Badge>}
          </div>
        </div>

        <div className="pt-6 border-t border-red-500/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-bold">
              {formatPrice(productPrice)}
            </span>
            <span className="text-sm text-muted-foreground">
              {product.default_price?.currency?.toUpperCase() || "USD"}
            </span>
          </div>
          <Button
            size="lg"
            className="w-full bg-red-500 hover:bg-red-600"
            disabled={!product.active}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {product.active ? "Add to Cart" : "Product Unavailable"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
