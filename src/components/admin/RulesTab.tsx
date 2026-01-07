import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRules, RulesContent } from "@/hooks/useRules";
import { Plus, Trash2, Save, GripVertical } from "lucide-react";

const RulesTab = () => {
  const { rules, updateRules } = useRules();
  const { toast } = useToast();
  const [editedRules, setEditedRules] = useState<RulesContent>(rules);
  const [newRule, setNewRule] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditedRules(rules);
  }, [rules]);

  const handleAddRule = () => {
    if (newRule.trim()) {
      setEditedRules((prev) => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()],
      }));
      setNewRule("");
    }
  };

  const handleRemoveRule = (index: number) => {
    setEditedRules((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateRule = (index: number, value: string) => {
    setEditedRules((prev) => ({
      ...prev,
      rules: prev.rules.map((rule, i) => (i === index ? value : rule)),
    }));
  };

  const handleMoveRule = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editedRules.rules.length) return;

    setEditedRules((prev) => {
      const newRules = [...prev.rules];
      [newRules[index], newRules[newIndex]] = [newRules[newIndex], newRules[index]];
      return { ...prev, rules: newRules };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await updateRules(editedRules);
    if (success) {
      toast({ title: "החוקים נשמרו בהצלחה!" });
    } else {
      toast({ title: "שגיאה בשמירת החוקים", variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="minecraft-card">
        <h2 className="text-xl font-bold mb-4">📜 ניהול חוקים</h2>

        {/* Title */}
        <div className="mb-6">
          <Label htmlFor="rulesTitle">כותרת החוקים</Label>
          <Input
            id="rulesTitle"
            value={editedRules.title}
            onChange={(e) =>
              setEditedRules((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="📜 חוקים"
            className="bg-background/50"
          />
        </div>

        {/* Add new rule */}
        <div className="mb-6">
          <Label>הוסף חוק חדש</Label>
          <div className="flex gap-2">
            <Input
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="הזן חוק חדש..."
              className="bg-background/50"
              onKeyDown={(e) => e.key === "Enter" && handleAddRule()}
            />
            <Button onClick={handleAddRule} variant="secondary">
              <Plus size={18} />
            </Button>
          </div>
        </div>

        {/* Rules list */}
        <div className="space-y-3">
          <Label>חוקים קיימים ({editedRules.rules.length})</Label>
          {editedRules.rules.map((rule, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleMoveRule(index, "up")}
                  disabled={index === 0}
                >
                  ▲
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleMoveRule(index, "down")}
                  disabled={index === editedRules.rules.length - 1}
                >
                  ▼
                </Button>
              </div>
              <span className="text-primary font-bold shrink-0">{index + 1}.</span>
              <Input
                value={rule}
                onChange={(e) => handleUpdateRule(index, e.target.value)}
                className="bg-background/50 flex-1"
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveRule(index)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}
          {editedRules.rules.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              אין חוקים עדיין. הוסף את החוק הראשון!
            </p>
          )}
        </div>

        {/* Save button */}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="ml-2" size={18} />
            {saving ? "שומר..." : "שמור שינויים"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RulesTab;
