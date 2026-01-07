import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCharacterImage = () => {
  const [characterImage, setCharacterImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacterImage();
  }, []);

  const fetchCharacterImage = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "character_image")
        .maybeSingle();

      if (data && !error && data.setting_value) {
        const value = data.setting_value as { url?: string } | string;
        if (typeof value === 'object' && value.url) {
          setCharacterImage(value.url);
        } else if (typeof value === 'string') {
          setCharacterImage(value);
        }
      }
    } catch (error) {
      console.error("Error fetching character image:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCharacterImage = async (imageUrl: string): Promise<boolean> => {
    try {
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", "character_image")
        .maybeSingle();

      let error;
      if (existing) {
        const result = await supabase
          .from("site_settings")
          .update({ 
            setting_value: { url: imageUrl },
            updated_at: new Date().toISOString()
          })
          .eq("setting_key", "character_image");
        error = result.error;
      } else {
        const result = await supabase
          .from("site_settings")
          .insert({ 
            setting_key: "character_image",
            setting_value: { url: imageUrl }
          });
        error = result.error;
      }

      if (!error) {
        setCharacterImage(imageUrl);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating character image:", error);
      return false;
    }
  };

  const uploadCharacterImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `character_${Date.now()}.${fileExt}`;
      const filePath = `characters/${fileName}`;

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
      console.error("Error uploading character image:", error);
      return null;
    }
  };

  return { 
    characterImage, 
    loading, 
    updateCharacterImage, 
    uploadCharacterImage,
    refetch: fetchCharacterImage 
  };
};
