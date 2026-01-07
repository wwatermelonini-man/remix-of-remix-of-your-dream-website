import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteContent {
  heroLogo: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  welcomeTitle: string;
  videosTitle: string;
  shortsTitle: string;
  contactTitle: string;
  pricingTitle: string;
  fontFamily: string;
}

const defaultContent: SiteContent = {
  heroLogo: "",
  heroTitle: "Crazy",
  heroTitleAccent: "Edits",
  heroSubtitle: "עריכות וידאו מקצועיות בעולם המיינקראפט",
  welcomeTitle: "🌟 ברוכים הבאים ל-CrazyPlay Edits 🌟",
  videosTitle: "🎬 דוגמאות סרטונים",
  shortsTitle: "📱 דוגמאות שורטס",
  contactTitle: "📞 יצירת קשר",
  pricingTitle: "💰 מחירון",
  fontFamily: "Rubik",
};

const availableFonts = [
  { name: "Rubik", value: "Rubik" },
  { name: "Heebo", value: "Heebo" },
  { name: "Assistant", value: "Assistant" },
  { name: "Varela Round", value: "Varela Round" },
  { name: "Secular One", value: "Secular One" },
  { name: "Alef", value: "Alef" },
];

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", "content")
        .maybeSingle();

      if (data && !error && data.setting_value) {
        const value = data.setting_value as unknown as SiteContent;
        setContent({ ...defaultContent, ...value });
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent: SiteContent) => {
    try {
      const jsonValue = JSON.parse(JSON.stringify(newContent));
      
      // Check if the setting exists
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", "content")
        .maybeSingle();

      let error;
      if (existing) {
        const result = await supabase
          .from("site_settings")
          .update({ 
            setting_value: jsonValue, 
            updated_at: new Date().toISOString() 
          })
          .eq("setting_key", "content");
        error = result.error;
      } else {
        const result = await supabase
          .from("site_settings")
          .insert({ 
            setting_key: "content",
            setting_value: jsonValue 
          });
        error = result.error;
      }

      if (!error) {
        setContent(newContent);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating content:", error);
      return false;
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("site-images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from("site-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  return { 
    content, 
    loading, 
    updateContent, 
    uploadImage,
    availableFonts,
    refetch: fetchContent 
  };
};
