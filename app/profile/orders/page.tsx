"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Search, Filter, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserPurchases, GroupedOrder } from "@/hooks/useUserPurchases";
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

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<GroupedOrder | null>(null);
  const {
    isLoading,
    error,
    filteredOrders,
    totalOrders,
    activeOrders,
    completedOrders,
    searchTerm,
    setSearchTerm,
  } = useUserPurchases();

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-lg mb-2 text-destructive">
          Error loading orders: {error}
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">
            View and track all your orders
          </p>
        </div>
      </motion.div>

      {/* Orders Overview */}
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
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Orders</p>
                <h3 className="text-2xl font-bold">{totalOrders}</h3>
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
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Active Orders</p>
                <h3 className="text-2xl font-bold">{activeOrders}</h3>
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
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Completed Orders</p>
                <h3 className="text-2xl font-bold">{completedOrders}</h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeIn}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders or products..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </motion.div>

      {/* Orders Table */}
      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">
                  {searchTerm
                    ? "No orders found matching your search"
                    : "No orders found"}
                </p>
                <p className="text-sm">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Start shopping to see your orders here!"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell className="text-right">
                        ${order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(
                      new Date(selectedOrder.date),
                      "MMM dd, yyyy 'at' HH:mm"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      selectedOrder.status === "Delivered"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Products</h4>
                <div className="space-y-3">
                  {selectedOrder.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {product.quantity} • $
                          {product.unit_price.toFixed(2)} each
                        </p>
                      </div>
                      <p className="font-medium">
                        ${product.total_price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="font-medium">Total</p>
                <p className="text-xl font-bold">
                  ${selectedOrder.total.toFixed(2)}
                </p>
              </div>

              {selectedOrder.stripe_payment_intent_id && (
                <div className="text-xs text-muted-foreground">
                  Payment ID: {selectedOrder.stripe_payment_intent_id}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
