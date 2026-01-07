import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminPassword = () => {
  const [loading, setLoading] = useState(true);

  const fetchPassword = async (): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "admin_password")
        .maybeSingle();

      if (data && !error) {
        const value = data.setting_value as { password?: string } | string;
        if (typeof value === 'object' && value.password) {
          return value.password;
        }
        if (typeof value === 'string') {
          return value;
        }
        return "admin123";
      }
      return "admin123";
    } catch (error) {
      console.error("Error fetching password:", error);
      return "admin123";
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = async (inputPassword: string): Promise<boolean> => {
    const storedPassword = await fetchPassword();
    return inputPassword === storedPassword;
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Verify current password first
      const storedPassword = await fetchPassword();
      if (currentPassword !== storedPassword) {
        return { success: false, error: "הסיסמה הנוכחית שגויה" };
      }

      // Use upsert to create the row if it doesn't exist, or update if it does
      const { error } = await supabase
        .from("site_settings")
        .upsert({ 
          setting_key: "admin_password",
          setting_value: { password: newPassword },
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'setting_key' 
        });

      if (error) {
        console.error("Error saving password:", error);
        return { success: false, error: "שגיאה בשמירת הסיסמה" };
      }
      return { success: true };
    } catch (error) {
      console.error("Error changing password:", error);
      return { success: false, error: "שגיאה בשינוי הסיסמה" };
    }
  };

  return { verifyPassword, changePassword, loading };
};
