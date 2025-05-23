import { useState } from "react";
import { useRouter } from "next/navigation";
import { StoreProduct } from "@/types/store-item";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Tag, ShoppingCart, FileText } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { ProductActions } from "./ProductActions";

interface ProductTableProps {
  products: StoreProduct[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function ProductTable({
  products,
  loading,
  onDelete,
}: ProductTableProps) {
  const router = useRouter();
  const [sortColumn, setSortColumn] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MM/dd/yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Render thumbnail with fallback
  const renderThumbnail = (product: StoreProduct) => {
    return (
      <div className="relative w-20 h-12 overflow-hidden rounded-md bg-muted">
        <Image
          src={product.image_url || "/images/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
    );
  };

  // Sort items
  const sortedProducts = [...products].sort((a, b) => {
    let valueA, valueB;

    switch (sortColumn) {
      case "name":
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case "price":
        valueA = a.price;
        valueB = b.price;
        break;
      case "category":
        valueA = a.category.toLowerCase();
        valueB = b.category.toLowerCase();
        break;
      case "created_at":
      default:
        valueA = new Date(a.created_at).getTime();
        valueB = new Date(b.created_at).getTime();
    }

    const comparison = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Toggle sort order
  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Render skeleton loader
  if (loading) {
    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-12 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Render empty state message
  if (products.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">
          No products found. Try changing the filters or adding new products.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => toggleSort("name")}
            >
              Name{" "}
              {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => toggleSort("category")}
            >
              Category{" "}
              {sortColumn === "category" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => toggleSort("price")}
            >
              Price{" "}
              {sortColumn === "price" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => toggleSort("created_at")}
            >
              Date{" "}
              {sortColumn === "created_at" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow
              key={product.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={(e) => {
                // Avoid navigation when clicking on action controls
                if (
                  (e.target as HTMLElement).closest(
                    '[data-no-navigation="true"]'
                  )
                )
                  return;
                router.push(`/store/${product.id}`);
              }}
            >
              <TableCell>{renderThumbnail(product)}</TableCell>
              <TableCell className="font-medium">
                <div className="line-clamp-2">{product.name}</div>
                <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                  {product.description}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{product.category}</span>
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                {formatPrice(product.price)}
              </TableCell>
              <TableCell>
                <Badge variant={product.active ? "default" : "destructive"}>
                  {product.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(product.created_at)}</TableCell>
              <TableCell>
                <div data-no-navigation="true">
                  <ProductActions product={product} onDelete={onDelete} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
