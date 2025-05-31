import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStripeProduct } from "@/lib/stripe";
import { ProductDetailsClient } from "./components/ProductDetailsClient";
import { ProductDetailsLoading } from "./components/ProductDetailsLoading";

interface ProductPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getStripeProduct(params.id);

  if (!product) {
    return {
      title: "Product Not Found | Battle Damage Studios",
    };
  }

  return {
    title: `${product.name} | Battle Damage Studios`,
    description:
      product.description ||
      `Purchase ${product.name} from Battle Damage Studios`,
    openGraph: {
      title: product.name,
      description:
        product.description ||
        `Purchase ${product.name} from Battle Damage Studios`,
      images: product.images.length > 0 ? [product.images[0]] : [],
      type: "website",
    },
  };
}

export const revalidate = 300;

export default async function ProductDetails({ params }: ProductPageProps) {
  const product = await getStripeProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <Suspense fallback={<ProductDetailsLoading />}>
          <ProductDetailsClient product={product} />
        </Suspense>
      </div>
    </div>
  );
}
