import { PageHeader } from "@/components/page-header";
import { StoreProductEditForm } from "./components/StoreProductEditForm";
import { fetchProductByIdApi } from "@/lib/storeApi";
import { notFound } from "next/navigation";

interface PageParams {
  id: string;
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const resolvedParams = await params;
  const product = await fetchProductByIdApi(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-24 max-w-4xl mx-auto">
      <PageHeader heading="Edit Product" text="Update product information" />
      <StoreProductEditForm product={product} />
    </div>
  );
}
