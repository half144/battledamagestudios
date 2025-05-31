"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Package,
  CreditCard,
  User,
  Mail,
  CalendarDays,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useUserPurchases } from "@/hooks/useUserPurchases";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ProfilePage() {
  const { profile, isLoading, isAuthenticated } = useAuthStatus();
  const {
    purchases,
    isLoading: purchasesLoading,
    error: purchasesError,
  } = useUserPurchases();

  console.log("[Profile Page] Current profile data:", profile);
  console.log("[Profile Page] User purchases:", purchases);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
        </div>

        {/* Profile Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Profile Details Skeleton */}
        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-48" />
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-5 w-32 mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-9 w-28" />
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return (
      <div className="text-center py-10">
        <p className="text-lg mb-2">Please log in to view your profile.</p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length > 1) {
      return (
        names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase()
      );
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Header Section */}
      <motion.div
        className="flex justify-between items-start"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Profile Overview
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and view your orders.
          </p>
        </div>
      </motion.div>

      {/* Profile Quick Actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={staggerContainer}
      >
        <motion.div
          variants={fadeIn}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Orders</p>
                <h3 className="text-2xl font-bold">
                  {profile.total_orders ?? 0}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeIn}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Spent</p>
                <h3 className="text-2xl font-bold">
                  ${(profile.total_spent ?? 0).toFixed(2)}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeIn}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <h3 className="text-xl font-bold">
                  {profile.member_since
                    ? format(new Date(profile.member_since), "MMM yyyy")
                    : "N/A"}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Profile Details */}
      <motion.div variants={fadeIn}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 text-3xl">
                <AvatarImage
                  src={profile.avatar_url || undefined}
                  alt={profile.username || "User Avatar"}
                />
                <AvatarFallback>
                  {getInitials(profile.full_name || profile.username)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-2xl font-bold flex items-center justify-center sm:justify-start">
                  <User className="w-6 h-6 mr-2 text-muted-foreground" />
                  {profile.full_name || profile.username || "User"}
                </h2>
                {profile.email && (
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start">
                    <Mail className="w-5 h-5 mr-2" />
                    {profile.email}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Orders Section */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <Link href="/profile/orders">
              <Button variant="ghost" size="sm">
                View All Orders
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {purchasesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : purchasesError ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Error loading recent orders: {purchasesError}</p>
              </div>
            ) : purchases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders found</p>
                <p className="text-sm">
                  Start shopping to see your orders here!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {purchases.slice(0, 5).map((purchase) => (
                  <motion.div
                    key={purchase.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{purchase.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {purchase.quantity} •{" "}
                          {format(
                            new Date(purchase.purchase_date),
                            "MMM dd, yyyy"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${purchase.total_amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${purchase.unit_price.toFixed(2)} each
                      </p>
                    </div>
                  </motion.div>
                ))}
                {purchases.length > 5 && (
                  <div className="text-center pt-4">
                    <Link href="/profile/orders">
                      <Button variant="outline" size="sm">
                        View {purchases.length - 5} more orders
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
