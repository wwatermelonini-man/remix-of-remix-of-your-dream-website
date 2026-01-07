import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCharacterImage } from "@/hooks/useCharacterImage";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";

const ImagesTab = () => {
  const { toast } = useToast();
  const { characterImage, updateCharacterImage, uploadCharacterImage } = useCharacterImage();
  const [uploading, setUploading] = useState(false);
  const [localImage, setLocalImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with fetched data
  useEffect(() => {
    if (characterImage) {
      setLocalImage(characterImage);
    }
  }, [characterImage]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadCharacterImage(file);
    if (url) {
      setLocalImage(url);
      const success = await updateCharacterImage(url);
      if (success) {
        toast({ title: "התמונה הועלתה ונשמרה בהצלחה!" });
      }
    } else {
      toast({ title: "שגיאה בהעלאת התמונה", variant: "destructive" });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploading(false);
  };

  const handleRemoveImage = async () => {
    const success = await updateCharacterImage("");
    if (success) {
      setLocalImage("");
      toast({ title: "התמונה הוסרה בהצלחה!" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Character Image Section */}
      <div className="minecraft-card">
        <h2 className="text-xl font-bold mb-4">🧑‍💻 תמונת הדמות (חלק ברוכים הבאים)</h2>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-48 h-48 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/30">
            {localImage || characterImage ? (
              <img 
                src={localImage || characterImage} 
                alt="Character" 
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-16 h-16 text-muted-foreground" />
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
              {uploading ? "מעלה..." : "העלה תמונה חדשה"}
            </Button>
            {(localImage || characterImage) && (
              <Button 
                onClick={handleRemoveImage}
                variant="ghost"
                className="text-destructive"
              >
                <Trash2 className="ml-2" size={18} />
                הסר תמונה
              </Button>
            )}
            <p className="text-sm text-muted-foreground">
              התמונה תופיע בחלק "ברוכים הבאים" באתר
            </p>
            <p className="text-xs text-muted-foreground">
              מומלץ: תמונה בגודל 384x384 פיקסלים או יותר
            </p>
          </div>
        </div>
      </div>

      <div className="minecraft-card bg-muted/20">
        <p className="text-sm text-muted-foreground text-center">
          💡 אם לא תעלה תמונה, תוצג תמונת ברירת המחדל
        </p>
      </div>
    </div>
  );
};

export default ImagesTab;
