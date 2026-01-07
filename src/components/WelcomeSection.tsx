import { Sparkles, Video, Briefcase, RefreshCw, Palette } from "lucide-react";
import minecraftCharacter from "@/assets/minecraft-character.png";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useCharacterImage } from "@/hooks/useCharacterImage";

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "עריכות מקצועיות וייחודיות",
    description: "סרטונים עם אפקטים מיוחדים, קצב מהיר ועיצוב מרשים שיגרום לצופה להישאר עד הרגע האחרון.",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "תיק עבודות",
    description: "אוסף של פרויקטים ועריכות קודמות שלי, כדי שתוכלו להתרשם מהסגנון ומהיכולות.",
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "עדכונים ושדרוגים שוטפים",
    description: "האתר מתעדכן באופן קבוע, כדי שתמיד תמצאו בו משהו חדש.",
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "שירותים אישיים",
    description: "מחפש עריכה מיוחדת לסרטון שלך? רוצה מיתוג, אנימציה או עיצוב בהתאמה אישית? אני כאן כדי להגשים את זה.",
  },
];

const WelcomeSection = () => {
  const { content } = useSiteContent();
  const { characterImage } = useCharacterImage();

  // Use custom character image if available, otherwise use default
  const displayImage = characterImage || minecraftCharacter;

  return (
    <section id="about" className="relative py-20 px-4">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 md:order-1">
            <h2 
              className="section-title text-right mb-6"
              style={{ fontFamily: `'${content.fontFamily}', sans-serif` }}
            >
              {content.welcomeTitle}
            </h2>
            
            <div className="minecraft-card mb-8">
              <p className="text-foreground leading-relaxed mb-4">
                👋 שלום לכולם!
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                כאן המקום שבו היצירתיות פוגשת את עולם Minecraft והתוכן הדיגיטלי.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                אני קרייזי פליי, יוצר תוכן, גיימר ועורך וידאו, שמאמין שכל רעיון יכול להפוך ליצירת אומנות אם נותנים לו את תשומת הלב הנכונה.
              </p>
            </div>

            <h3 className="text-xl font-bold text-primary mb-4">
              🎥 מה מחכה לכם כאן באתר?
            </h3>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50 transition-all duration-300 hover:bg-secondary/50 hover:border-primary/30"
                >
                  <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      ✨ {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Character Image */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <img
                src={displayImage}
                alt="Minecraft Character"
                className="w-72 md:w-96 rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
