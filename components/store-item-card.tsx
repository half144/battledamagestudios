"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { StoreItem } from "@/data/store";
import { CartItem } from "@/store/cart";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type StoreItemCardProps = {
  item: StoreItem;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
};

export function StoreItemCard({ item, addToCart }: StoreItemCardProps) {
  const { isAuthenticated } = useAuthStatus();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("You need to be logged in to add items to cart");
      router.push("/login");
      return;
    }

    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });

    toast.success(`${item.name} added to cart!`);
  };

  return (
    <Link href={`/store/${item.id}`}>
      <MagicCard
        className="relative overflow-hidden group h-full"
        gradientFrom="rgb(239 68 68)"
        gradientTo="rgb(185 28 28)"
        gradientOpacity={0.2}
      >
        {item.featured && (
          <div className="absolute top-2 right-2 z-10">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
              Featured
            </span>
          </div>
        )}
        <div className="h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {item.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-bold">${item.price.toFixed(2)}</span>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </MagicCard>
    </Link>
  );
}
