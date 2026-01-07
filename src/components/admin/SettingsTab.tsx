import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAdminPassword } from "@/hooks/useAdminPassword";
import { Save, Lock, Eye, EyeOff } from "lucide-react";

const SettingsTab = () => {
  const { toast } = useToast();
  const { changePassword } = useAdminPassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "נא למלא את כל השדות", variant: "destructive" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: "הסיסמאות אינן תואמות", variant: "destructive" });
      return;
    }

    if (newPassword.length < 4) {
      toast({ title: "הסיסמה חייבת להכיל לפחות 4 תווים", variant: "destructive" });
      return;
    }

    setSaving(true);
    const result = await changePassword(currentPassword, newPassword);
    
    if (result.success) {
      toast({ title: "הסיסמה שונתה בהצלחה!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast({ title: result.error || "שגיאה בשינוי הסיסמה", variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <div className="minecraft-card">
        <h2 className="text-xl font-bold mb-4">🔐 שינוי סיסמה</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="currentPassword">סיסמה נוכחית</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="הזן סיסמה נוכחית..."
                className="bg-background/50 pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="newPassword">סיסמה חדשה</Label>
            <Input
              id="newPassword"
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="הזן סיסמה חדשה..."
              className="bg-background/50"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">אימות סיסמה חדשה</Label>
            <Input
              id="confirmPassword"
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="הזן שוב את הסיסמה החדשה..."
              className="bg-background/50"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPasswords(!showPasswords)}
            >
              {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="mr-2">{showPasswords ? "הסתר" : "הצג"} סיסמאות</span>
            </Button>
          </div>

          <Button 
            onClick={handleChangePassword} 
            disabled={saving}
            className="w-full"
          >
            <Lock className="ml-2" size={18} />
            {saving ? "משנה..." : "שנה סיסמה"}
          </Button>
        </div>
      </div>

      <div className="minecraft-card bg-muted/20">
        <p className="text-sm text-muted-foreground text-center">
          ⚠️ לאחר שינוי הסיסמה, תצטרך להשתמש בסיסמה החדשה בכניסה הבאה
        </p>
      </div>
    </div>
  );
};

export default SettingsTab;
