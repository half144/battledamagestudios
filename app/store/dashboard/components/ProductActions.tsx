import { Button } from "@/components/ui/button";
import { StoreProduct } from "@/types/store-item";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductActionsProps {
  product: StoreProduct;
  onDelete: (id: string) => void;
}

export function ProductActions({ product, onDelete }: ProductActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = `/store/${product.id}`;
        }}
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">View</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/store/${product.id}/edit`);
        }}
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(product.id);
        }}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
