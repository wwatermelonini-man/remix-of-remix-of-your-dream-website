import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent, SiteContent } from "@/hooks/useSiteContent";
import { Upload, Save, Eye, X, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ContentTab = () => {
  const { toast } = useToast();
  const { content, updateContent, uploadImage, availableFonts } = useSiteContent();
  const [editedContent, setEditedContent] = useState<SiteContent>(content);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync local editor state with fetched content (so reopening the admin panel doesn't reset fields)
  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadImage(file);
    if (url) {
      setEditedContent((prev) => ({ ...prev, heroLogo: url }));
      toast({ title: "התמונה הועלתה בהצלחה!" });
    } else {
      toast({ title: "שגיאה בהעלאת התמונה", variant: "destructive" });
    }

    // Allow uploading the same file again
    if (fileInputRef.current) fileInputRef.current.value = "";

    setUploading(false);
  };

  const handleSave = async () => {
    // Prevent accidental logo deletion when the editor hasn't loaded yet / field is empty
    const toSave: SiteContent = {
      ...editedContent,
      heroLogo: editedContent.heroLogo || content.heroLogo || "",
    };

    const success = await updateContent(toSave);
    if (success) {
      setEditedContent(toSave);
      toast({ title: "התוכן עודכן בהצלחה!" });
    } else {
      toast({ title: "שגיאה בעדכון התוכן", variant: "destructive" });
    }
  };

  const getPreviewStyle = () => {
    return {
      fontFamily: `'${editedContent.fontFamily}', sans-serif`,
    };
  };

  return (
    <div className="space-y-6">
      {/* Logo Section */}
      <div className="minecraft-card">
        <h2 className="text-xl font-bold mb-4">🖼️ לוגו האתר</h2>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/30">
            {editedContent.heroLogo ? (
              <img 
                src={editedContent.heroLogo} 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              variant="outline"
            >
              <Upload className="ml-2" size={18} />
              {uploading ? "מעלה..." : "העלה לוגו חדש"}
            </Button>
            <p className="text-sm text-muted-foreground">
              מומלץ: תמונה מרובעת בגודל 256x256 פיקסלים
            </p>
          </div>
        </div>
      </div>

      {/* Hero Text Section */}
      <div className="minecraft-card">
        <h2 className="text-xl font-bold mb-4">✏️ כותרות ראשיות</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="heroTitle">כותרת ראשית (חלק 1)</Label>
            <Input
              id="heroTitle"
              value={editedContent.heroTitle}
              onChange={(e) =>
                setEditedContent((prev) => ({ ...prev, heroTitle: e.target.value }))
              }
              placeholder="Crazy"
              className="bg-background/50"
            />
          </div>
          <div>
            <Label htmlFor="heroTitleAccent">כותרת ראשית (חלק 2)</Label>
            <Input
              id="heroTitleAccent"
              value={editedContent.heroTitleAccent}
              onChange={(e) =>
                setEditedContent((prev) => ({ ...prev, heroTitleAccent: e.target.value }))
              }
              placeholder="Edits"
              className="bg-background/50"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="heroSubtitle">תת-כותרת</Label>
            <Input
              id="heroSubtitle"
              value={editedContent.heroSubtitle}
              onChange={(e) =>
                setEditedContent((prev) => ({ ...prev, heroSubtitle: e.target.value }))
              }
              placeholder="עריכות וידאו מקצועיות..."
              className="bg-background/50"
            />
          </div>
        </div>
      </div>

      {/* Section Titles */}
      <div className="minecraft-card">
        <h2 className="text-xl font-bold mb-4">📝 כותרות חלקים</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="welcomeTitle">כותרת ברוכים הבאים</Label>
            <Input
              id="welcomeTitle"
              value={editedContent.welcomeTitle}
              onChange={(e) =>
                setEditedContent((prev) => ({ ...prev, welcomeTitle: e.target.value }))
              }
              className="bg-background/50"
            />
          </div>
          <div>
            <Label htmlFor="videosTitle">כותרת סרטונים</Label>
            <Input
              id="videosTitle"
              value={editedContent.videosTitle}
              onChange={(e) =>
                setEditedContent((prev) => ({ ...prev, videosTitle: e.target.value }))
              }
              className="bg-background/50"
            />
          </div>
          <div>
            <Label htmlFor="shortsTitle">כותרת שורטס</Label>
            <Input
              id="shortsTitle"
              value={editedContent.shortsTitle}
              onChange={(e) =>
                setEditedContent((prev) => ({ ...prev, shortsTitle: e.target.value }))
              }
              className="bg-background/50"
            />
          </div>
          <div>
            <Label htmlFor="contactTitle">כותרת יצירת קשר</Label>
            <Input
              id="contactTitle"
              value={editedContent.contactTitle}
              onChange={(e) =>
                setEditedContent((prev) => ({ ...prev, contactTitle: e.target.value }))
              }
              className="bg-background/50"
            />
          </div>
          <div>
            <Label htmlFor="pricingTitle">כותרת מחירון</Label>
            <Input
              id="pricingTitle"
              value={editedContent.pricingTitle}
              onChange={(e) =>
                setEditedContent((prev) => ({ ...prev, pricingTitle: e.target.value }))
              }
              className="bg-background/50"
            />
          </div>
        </div>
      </div>

      {/* Font Selection */}
      <div className="minecraft-card">
        <h2 className="text-xl font-bold mb-4">🔤 גופן</h2>
        <div>
          <Label htmlFor="fontFamily">בחר גופן לכותרות</Label>
          <select
            id="fontFamily"
            value={editedContent.fontFamily}
            onChange={(e) =>
              setEditedContent((prev) => ({ ...prev, fontFamily: e.target.value }))
            }
            className="w-full h-10 px-3 rounded-md bg-background/50 border border-input mt-2"
          >
            {availableFonts.map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={() => setShowPreview(true)} variant="outline" className="flex-1">
          <Eye className="ml-2" size={18} />
          תצוגה מקדימה
        </Button>
        <Button onClick={handleSave} className="flex-1">
          <Save className="ml-2" size={18} />
          שמור שינויים
        </Button>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">תצוגה מקדימה</DialogTitle>
          </DialogHeader>
          
          <div 
            className="space-y-6 p-4 bg-background rounded-lg" 
            style={getPreviewStyle()}
          >
            {/* Hero Preview */}
            <div className="text-center py-8 border border-border rounded-lg bg-muted/20">
              {editedContent.heroLogo && (
                <img 
                  src={editedContent.heroLogo} 
                  alt="Logo Preview"
                  className="w-24 h-24 mx-auto mb-4 rounded-xl"
                />
              )}
              <h1 className="text-4xl font-extrabold mb-2">
                <span className="text-primary">{editedContent.heroTitle}</span>
                <span className="text-accent">{editedContent.heroTitleAccent}</span>
              </h1>
              <p className="text-muted-foreground">{editedContent.heroSubtitle}</p>
            </div>

            {/* Section Titles Preview */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-primary">כותרות חלקים:</h3>
              <div className="grid gap-2">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <span className="section-title text-lg">{editedContent.welcomeTitle}</span>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <span className="section-title text-lg">{editedContent.videosTitle}</span>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <span className="section-title text-lg">{editedContent.shortsTitle}</span>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <span className="section-title text-lg">{editedContent.contactTitle}</span>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <span className="section-title text-lg">{editedContent.pricingTitle}</span>
                </div>
              </div>
            </div>

            {/* Font Preview */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">גופן נבחר:</p>
              <p className="text-xl font-bold">{editedContent.fontFamily}</p>
              <p className="mt-2">אבגדהוזחטיכלמנסעפצקרשת 0123456789</p>
            </div>
          </div>

          <Button onClick={() => setShowPreview(false)} className="w-full">
            <X className="ml-2" size={18} />
            סגור תצוגה מקדימה
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentTab;
