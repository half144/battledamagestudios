import { motion } from "framer-motion";

interface StoreEmptyStateProps {
  hasProducts: boolean;
}

export const StoreEmptyState = ({ hasProducts }: StoreEmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <p className="text-muted-foreground">
        No products found matching your criteria.
      </p>
      {!hasProducts && (
        <p className="text-sm text-muted-foreground mt-2">
          Add products to Stripe to see them here.
        </p>
      )}
    </motion.div>
  );
};
