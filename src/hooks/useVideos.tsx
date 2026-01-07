import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Video {
  id: string;
  title: string;
  video_url: string;
  video_type: "youtube" | "tiktok" | "youtube_shorts";
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("display_order", { ascending: true });

      if (data && !error) {
        setVideos(data as Video[]);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const addVideo = async (video: Omit<Video, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .insert([video])
        .select()
        .single();

      if (data && !error) {
        setVideos((prev) => [...prev, data as Video]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding video:", error);
      return false;
    }
  };

  const updateVideo = async (id: string, updates: Partial<Video>) => {
    try {
      const { error } = await supabase
        .from("videos")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (!error) {
        setVideos((prev) =>
          prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating video:", error);
      return false;
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase.from("videos").delete().eq("id", id);

      if (!error) {
        setVideos((prev) => prev.filter((v) => v.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting video:", error);
      return false;
    }
  };

  return { videos, loading, addVideo, updateVideo, deleteVideo, refetch: fetchVideos };
};
