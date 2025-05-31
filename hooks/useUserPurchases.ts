import { useState, useEffect, useMemo } from "react";

export interface UserPurchase {
  id: string;
  user_id: string;
  product_id: string; // Stripe Product ID
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  purchase_date: string;
  stripe_payment_intent_id: string;
  order_id: string;
  order_total: number;
  payment_status: string;
}

export interface GroupedOrder {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
  stripe_payment_intent_id: string;
  products: {
    id: string;
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    product_id: string;
  }[];
}

interface UseUserPurchasesReturn {
  purchases: UserPurchase[];
  groupedOrders: GroupedOrder[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredOrders: GroupedOrder[];
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
}

export function useUserPurchases(): UseUserPurchasesReturn {
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/user/purchases", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch purchases");
      }

      const data = await response.json();

      if (data.success) {
        setPurchases(data.purchases || []);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error fetching user purchases:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setPurchases([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Agrupar compras por pedido
  const groupedOrders = useMemo(() => {
    const orderMap = new Map<string, GroupedOrder>();

    purchases.forEach((purchase) => {
      if (!orderMap.has(purchase.order_id)) {
        orderMap.set(purchase.order_id, {
          id: purchase.order_id,
          date: purchase.purchase_date,
          status:
            purchase.payment_status === "paid" ? "Delivered" : "Processing",
          total: purchase.order_total,
          items: 0,
          stripe_payment_intent_id: purchase.stripe_payment_intent_id,
          products: [],
        });
      }

      const order = orderMap.get(purchase.order_id)!;
      order.products.push({
        id: purchase.id,
        name: purchase.product_name,
        quantity: purchase.quantity,
        unit_price: purchase.unit_price,
        total_price: purchase.total_amount,
        product_id: purchase.product_id,
      });
      order.items = order.products.length;
    });

    return Array.from(orderMap.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [purchases]);

  // Filtrar pedidos baseado no termo de busca
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return groupedOrders;

    return groupedOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [groupedOrders, searchTerm]);

  // Estatísticas dos pedidos
  const totalOrders = groupedOrders.length;
  const activeOrders = groupedOrders.filter(
    (order) => order.status === "Processing"
  ).length;
  const completedOrders = groupedOrders.filter(
    (order) => order.status === "Delivered"
  ).length;

  useEffect(() => {
    fetchPurchases();
  }, []);

  return {
    purchases,
    groupedOrders,
    isLoading,
    error,
    refetch: fetchPurchases,
    searchTerm,
    setSearchTerm,
    filteredOrders,
    totalOrders,
    activeOrders,
    completedOrders,
  };
}
