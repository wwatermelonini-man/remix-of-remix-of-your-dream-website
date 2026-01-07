import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RulesContent {
  title: string;
  rules: string[];
}

const defaultRules: RulesContent = {
  title: "📜 חוקים",
  rules: [
    "יש לכבד את כל המשתמשים",
    "אין לשלוח ספאם או תוכן לא הולם",
    "יש לשלם לפני קבלת השירות",
    "זמן אספקה עשוי להשתנות בהתאם לעומס",
    "אין החזרים לאחר התחלת העבודה",
  ],
};

export const useRules = () => {
  const [rules, setRules] = useState<RulesContent>(defaultRules);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", "rules")
        .maybeSingle();

      if (data && !error && data.setting_value) {
        const value = data.setting_value as unknown as RulesContent;
        setRules({ ...defaultRules, ...value });
      }
    } catch (error) {
      console.error("Error fetching rules:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateRules = async (newRules: RulesContent) => {
    try {
      const jsonValue = JSON.parse(JSON.stringify(newRules));

      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", "rules")
        .maybeSingle();

      let error;
      if (existing) {
        const result = await supabase
          .from("site_settings")
          .update({
            setting_value: jsonValue,
            updated_at: new Date().toISOString(),
          })
          .eq("setting_key", "rules");
        error = result.error;
      } else {
        const result = await supabase
          .from("site_settings")
          .insert({
            setting_key: "rules",
            setting_value: jsonValue,
          });
        error = result.error;
      }

      if (!error) {
        setRules(newRules);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating rules:", error);
      return false;
    }
  };

  return {
    rules,
    loading,
    updateRules,
    refetch: fetchRules,
  };
};
