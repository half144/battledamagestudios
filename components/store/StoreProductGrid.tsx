import { motion } from "framer-motion";
import { StripeProduct } from "@/types/stripe";
import { StoreItemCard } from "@/components/store-item-card";
import { getProductPrice, getProductCategory } from "@/utils/productFilters";

interface StoreProductGridProps {
  products: StripeProduct[];
  onAddToCart: (item: any) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const StoreProductGrid = ({
  products,
  onAddToCart,
}: StoreProductGridProps) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id}>
          <StoreItemCard
            item={{
              id: product.id,
              name: product.name,
              price: getProductPrice(product),
              image: product.images[0] || "/placeholder-product.jpg",
              description: product.description,
              featured: product.active,
              tags: [getProductCategory(product)],
              category: (getProductCategory(product) || "general") as any,
              rating: 4.5,
            }}
            addToCart={onAddToCart}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
