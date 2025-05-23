"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profile";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { StoreProduct } from "@/types/store-item";
import { createProductApi } from "@/lib/storeApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CreateProduct() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<
    Omit<StoreProduct, "id" | "created_at">
  >({
    name: "",
    description: "",
    price: 0,
    category: "",
    image_url: "",
    file_url: "",
    active: true,
    stripe_product_id: "",
    stripe_price_id: "",
  });

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle number input change
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = parseFloat(e.target.value);
    setFormData((prev) => ({ ...prev, [field]: isNaN(value) ? 0 : value }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Validate form
      if (!formData.name || !formData.description || !formData.image_url) {
        toast.error("Please fill in all required fields");
        return;
      }

      const productId = await createProductApi(formData);

      if (!productId) {
        throw new Error("Failed to create product");
      }

      toast.success("Product created successfully!");
      router.push("/store/dashboard");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in and admin
  if (!profile) {
    return <div className="container py-12">Loading profile...</div>;
  }

  // Redirect if user is not admin
  if (profile.role !== "admin") {
    toast.error("You don't have permission to create products");
    router.push("/");
    return null;
  }

  return (
    <div className="container py-24 max-w-4xl mx-auto">
      <PageHeader
        heading="Add Product"
        text="Create a new product for the store"
      />

      <Card className="mt-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => handleNumberChange(e, "price")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL *</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file_url">File URL (optional)</Label>
                <Input
                  id="file_url"
                  name="file_url"
                  placeholder="https://example.com/file.pdf"
                  value={formData.file_url}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Product category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe_product_id">
                  Stripe Product ID (optional)
                </Label>
                <Input
                  id="stripe_product_id"
                  name="stripe_product_id"
                  placeholder="prod_..."
                  value={formData.stripe_product_id}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe_price_id">
                  Stripe Price ID (optional)
                </Label>
                <Input
                  id="stripe_price_id"
                  name="stripe_price_id"
                  placeholder="price_..."
                  value={formData.stripe_price_id}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the product..."
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label
                  htmlFor="active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Product active
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/store/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
