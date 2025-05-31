"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="border-orange-500/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <XCircle className="w-16 h-16 text-orange-500" />
              </div>
              <CardTitle className="text-2xl text-orange-500">
                Checkout Cancelled
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-lg">Your payment was cancelled.</p>
                <p className="text-muted-foreground">
                  No charges were made to your account. Your cart items are
                  still saved.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium">Your cart is still here!</p>
                    <p className="text-sm text-muted-foreground">
                      All your selected items are saved. You can continue
                      shopping or try checkout again.
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
