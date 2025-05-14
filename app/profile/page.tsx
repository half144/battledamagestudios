"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, CreditCard, MapPin, Bell, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { syncSessionApi } from "@/lib/authApi";
import { useToast } from "@/hooks/use-toast";
import { useAuthStatus } from "@/hooks/useAuthStatus";

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
  const [syncingSession, setSyncingSession] = useState(false);
  const { toast } = useToast();
  const { checkAuth } = useAuthStatus();

  // Função para sincronizar a sessão manualmente
  const handleSyncSession = async () => {
    setSyncingSession(true);
    try {
      const result = await syncSessionApi();

      if (result.success) {
        toast({
          title: "Sessão sincronizada",
          description: "Sua sessão foi sincronizada com sucesso.",
          variant: "default",
        });

        // Recarregar a autenticação
        await checkAuth();
      } else {
        toast({
          title: "Falha ao sincronizar",
          description:
            result.error || "Ocorreu um erro ao sincronizar sua sessão.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao sincronizar sessão:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setSyncingSession(false);
    }
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
            Manage your account settings and view your orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSyncSession}
            disabled={syncingSession}
            title="Sincronizar sessão"
          >
            <RefreshCw
              className={`h-4 w-4 ${syncingSession ? "animate-spin" : ""}`}
            />
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
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
        ></motion.div>
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
