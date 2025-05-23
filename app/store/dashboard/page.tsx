"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profile";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ProductTable, ProductFilters } from "./components";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { StoreProduct } from "@/types/store-item";
import { fetchProductsApi, deleteProductApi } from "@/lib/storeApi";

export default function StoreDashboard() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const [allProducts, setAllProducts] = useState<StoreProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState<"all" | "true" | "false">(
    "all"
  );

  // Extract unique categories from data
  const categories = useMemo(() => {
    if (!allProducts.length) return [];

    const uniqueCategories = Array.from(
      new Set(allProducts.map((product) => product.category).filter(Boolean))
    );

    return uniqueCategories as string[];
  }, [allProducts]);

  // Load data once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchProductsApi();

        if (!data) {
          throw new Error("Failed to fetch products");
        }

        setAllProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
        setError("Error loading products: " + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply in-memory filters when filters change
  useEffect(() => {
    // If no active filters, use all data
    if (
      searchQuery === "" &&
      categoryFilter === "all" &&
      activeFilter === "all"
    ) {
      setFilteredProducts(allProducts);
      return;
    }

    let filtered = [...allProducts];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Filter by active status
    if (activeFilter !== "all") {
      const isActive = activeFilter === "true";
      filtered = filtered.filter((product) => product.active === isActive);
    }

    setFilteredProducts(filtered);
  }, [allProducts, searchQuery, categoryFilter, activeFilter]);

  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const success = await deleteProductApi(id);

      if (!success) {
        throw new Error("Failed to delete product");
      }

      setAllProducts((prev) => prev.filter((product) => product.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Check if user is logged in and admin
  if (!profile) {
    return <div className="container py-12">Loading profile...</div>;
  }

  // Redirect if user is not admin
  if (profile.role !== "admin") {
    toast.error("You don't have permission to access the store dashboard");
    router.push("/");
    return null;
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="container py-24 max-w-7xl mx-auto">
        <PageHeader
          heading="Store Dashboard"
          text="Manage all store products"
        />
        <div className="mt-8 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="mt-2 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container py-24 max-w-7xl mx-auto">
        <PageHeader
          heading="Store Dashboard"
          text="Manage all store products"
        />
        <div className="mt-8 p-4 bg-destructive/10 text-destructive rounded-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-24 max-w-7xl mx-auto">
      <PageHeader heading="Store Dashboard" text="Manage all store products" />

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <ProductFilters
            onSearchChange={setSearchQuery}
            onCategoryChange={setCategoryFilter}
            onActiveChange={setActiveFilter}
            categories={categories}
          />

          <Button
            onClick={() => router.push("/store/create")}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </div>

        <div className="bg-card rounded-md border shadow-sm">
          <ProductTable
            products={filteredProducts}
            loading={loading}
            onDelete={handleDeleteProduct}
          />
        </div>
      </div>
    </div>
  );
}
