"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, CreditCard, MapPin, Bell } from "lucide-react";
import Link from "next/link";

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
            Manage your account settings and view your orders
          </p>
        </div>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
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
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Active Orders</p>
                <h3 className="text-2xl font-bold">3</h3>
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
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Spent</p>
                <h3 className="text-2xl font-bold">$529.99</h3>
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
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Shipping Address</p>
                <p className="text-sm text-muted-foreground">
                  2 saved addresses
                </p>
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
            <CardContent className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src="/placeholder-avatar.png"
                  alt="Profile picture"
                />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">John Doe</h2>
                <p className="text-muted-foreground">john.doe@example.com</p>
                <div className="flex gap-2 mt-2">
                  <Badge>Premium Member</Badge>
                  <Badge variant="outline">Since Jan 2025</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/profile/orders">
              <Button variant="ghost" size="sm">
                View All Orders
              </Button>
            </Link>
          </CardHeader>
        </Card>
      </motion.div>
    </motion.div>
  );
}
