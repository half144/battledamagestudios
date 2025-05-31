import { Suspense } from "react";
import { Metadata } from "next";
import { getStripeProducts } from "@/lib/stripe";
import { StoreHeader } from "@/components/store-header";
import { StoreClient } from "@/components/store/StoreClient";
import { StoreServerActions } from "@/components/store/StoreServerActions";
import { StoreLoadingState } from "@/components/store/StoreLoadingState";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Store | Battle Damage Studios",
  description:
    "Discover our collection of digital products, assets, and resources for game development and creative projects.",
  keywords: [
    "store",
    "digital products",
    "game assets",
    "battle damage studios",
  ],
  openGraph: {
    title: "Store | Battle Damage Studios",
    description:
      "Discover our collection of digital products, assets, and resources for game development and creative projects.",
    type: "website",
  },
};

export const revalidate = 300;
export const dynamic = "force-static";

async function getIsAdmin() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("sb-rnqhnainrwsbyeyvttcm-auth-token");

    if (!authToken) return false;

    const tokenData = JSON.parse(authToken.value);
    const token = tokenData[0];

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) return false;

    const user = await response.json();
    return user?.user_metadata?.role === "admin";
  } catch {
    return false;
  }
}

export default async function Store() {
  const [products, isAdmin] = await Promise.all([
    getStripeProducts(),
    getIsAdmin(),
  ]);

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <StoreHeader />
          <StoreServerActions isAdmin={isAdmin} />
        </div>

        <Suspense fallback={<StoreLoadingState />}>
          <StoreClient products={products} />
        </Suspense>
      </div>
    </div>
  );
}
