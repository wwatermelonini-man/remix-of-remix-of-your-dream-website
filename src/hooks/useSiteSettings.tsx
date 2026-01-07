import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BackgroundSettings {
  type: "solid" | "gradient" | "animated";
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  animated?: boolean;
  customImage?: string; // custom background image URL for animated type
}

export const useSiteSettings = () => {
  const [background, setBackground] = useState<BackgroundSettings>({
    type: "solid",
    color: "#0a0a0a",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", "background")
        .maybeSingle();

      if (data && !error && data.setting_value) {
        const value = data.setting_value as unknown as BackgroundSettings;
        setBackground(value);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBackground = async (newSettings: BackgroundSettings) => {
    try {
      const jsonValue = JSON.parse(JSON.stringify(newSettings));
      const { error } = await supabase
        .from("site_settings")
        .update({ 
          setting_value: jsonValue, 
          updated_at: new Date().toISOString() 
        })
        .eq("setting_key", "background");

      if (!error) {
        setBackground(newSettings);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating background:", error);
      return false;
    }
  };

  const uploadBackgroundImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `bg_${Date.now()}.${fileExt}`;
      const filePath = `backgrounds/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("site-images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return null;
      }

      const { data } = supabase.storage.from("site-images").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading background:", error);
      return null;
    }
  };

  return { background, loading, updateBackground, uploadBackgroundImage, refetch: fetchSettings };
};
