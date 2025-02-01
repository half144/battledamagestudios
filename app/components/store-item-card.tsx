"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { ShoppingCart, Star } from "lucide-react";
import { StoreItem } from "@/data/store";
import { CartItem } from "@/store/cart";

type StoreItemCardProps = {
  item: StoreItem;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
};

export function StoreItemCard({ item, addToCart }: StoreItemCardProps) {
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
            <Badge className="bg-red-500">Featured</Badge>
          </div>
        )}
        <div className="p-4 space-y-4 h-full flex flex-col">
          <div className="aspect-square relative bg-gradient-to-br from-red-500/10 to-purple-500/10 rounded-lg overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{item.name}</h3>
            <p className="text-muted-foreground">{item.description}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="space-y-1">
              <span className="text-2xl font-bold">${item.price}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-red-500 text-red-500" />
                <span className="text-sm text-muted-foreground">
                  {item.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={(e) => {
                e.preventDefault();
                addToCart({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                });
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </MagicCard>
    </Link>
  );
}
