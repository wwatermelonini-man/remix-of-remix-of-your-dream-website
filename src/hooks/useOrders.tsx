import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Order {
  id: string;
  package_id: string | null;
  package_name: string;
  price: number;
  discord_name: string;
  email: string;
  status: string;
  paypal_order_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating order:", error);
      return false;
    }

    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
    return true;
  };

  const deleteOrder = async (id: string) => {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting order:", error);
      return false;
    }

    setOrders((prev) => prev.filter((order) => order.id !== id));
    return true;
  };

  return { orders, loading, refetch: fetchOrders, updateOrderStatus, deleteOrder };
};
