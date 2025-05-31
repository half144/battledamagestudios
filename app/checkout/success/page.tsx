"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { motion } from "framer-motion";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Limpar o carrinho após checkout bem-sucedido
    if (sessionId) {
      clearCart();
    }
    setIsLoading(false);
  }, [sessionId, clearCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="border-green-500/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-500">
                Payment Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-lg">Thank you for your purchase!</p>
                <p className="text-muted-foreground">
                  Your order has been confirmed and is being processed.
                </p>
                {sessionId && (
                  <p className="text-sm text-muted-foreground">
                    Order ID: {sessionId}
                  </p>
                )}
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium">What happens next?</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive an email confirmation with your purchase
                      details and download links (if applicable).
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/store">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Go to Homepage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
      <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
