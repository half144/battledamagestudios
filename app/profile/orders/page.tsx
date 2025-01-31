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
import { Package, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
  products: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    date: "2025-01-31",
    status: "Delivered",
    total: 129.99,
    items: 2,
    products: [
      {
        name: "Gaming Mouse",
        quantity: 1,
        price: 79.99,
      },
      {
        name: "Mousepad",
        quantity: 1,
        price: 50.0,
      },
    ],
  },
  {
    id: "ORD-002",
    date: "2025-01-25",
    status: "Processing",
    total: 79.99,
    items: 1,
    products: [
      {
        name: "Gaming Keyboard",
        quantity: 1,
        price: 79.99,
      },
    ],
  },
  {
    id: "ORD-003",
    date: "2025-01-20",
    status: "Delivered",
    total: 299.99,
    items: 3,
    products: [
      {
        name: "Gaming Headset",
        quantity: 1,
        price: 199.99,
      },
      {
        name: "USB Hub",
        quantity: 2,
        price: 50.0,
      },
    ],
  },
];

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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
                <h3 className="text-2xl font-bold">{mockOrders.length}</h3>
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
                <h3 className="text-2xl font-bold">
                  {
                    mockOrders.filter((order) => order.status === "Processing")
                      .length
                  }
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
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Completed Orders</p>
                <h3 className="text-2xl font-bold">
                  {
                    mockOrders.filter((order) => order.status === "Delivered")
                      .length
                  }
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeIn}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-9" />
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
                {mockOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "Delivered" ? "default" : "secondary"
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
                  <p className="font-medium">{selectedOrder.date}</p>
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
                  {selectedOrder.products.map(
                    (
                      product: {
                        name: string;
                        quantity: number;
                        price: number;
                      },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {product.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          ${(product.price * product.quantity).toFixed(2)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="font-medium">Total</p>
                <p className="text-xl font-bold">
                  ${selectedOrder.total.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
