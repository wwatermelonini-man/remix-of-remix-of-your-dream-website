import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PricingPackage {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export const usePricing = () => {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("pricing_packages")
        .select("*")
        .order("display_order", { ascending: true });

      if (data && !error) {
        const parsed = data.map((pkg) => ({
          ...pkg,
          features: Array.isArray(pkg.features) ? pkg.features : [],
        })) as PricingPackage[];
        setPackages(parsed);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPackage = async (pkg: Omit<PricingPackage, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from("pricing_packages")
        .insert([pkg])
        .select()
        .single();

      if (data && !error) {
        const parsed = {
          ...data,
          features: Array.isArray(data.features) ? data.features : [],
        } as PricingPackage;
        setPackages((prev) => [...prev, parsed]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding package:", error);
      return false;
    }
  };

  const updatePackage = async (id: string, updates: Partial<PricingPackage>) => {
    try {
      const { error } = await supabase
        .from("pricing_packages")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (!error) {
        setPackages((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating package:", error);
      return false;
    }
  };

  const deletePackage = async (id: string) => {
    try {
      const { error } = await supabase.from("pricing_packages").delete().eq("id", id);

      if (!error) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting package:", error);
      return false;
    }
  };

  return { packages, loading, addPackage, updatePackage, deletePackage, refetch: fetchPackages };
};
