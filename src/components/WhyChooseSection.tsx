import { Check, Heart, Zap, Star } from "lucide-react";

const reasons = [
  {
    icon: <Heart className="w-5 h-5" />,
    text: "שילוב של אהבה למיינקראפט עם מקצועיות בעריכה.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    text: "התאמה אישית לכל לקוח – כל פרויקט מקבל תשומת לב מלאה.",
  },
  {
    icon: <Star className="w-5 h-5" />,
    text: "תוצאה שתגרום לעוקבים שלך לרצות עוד.",
  },
];

const WhyChooseSection = () => {
  return (
    <section className="relative py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="minecraft-card text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
            🎮 למה לבחור ב-CrazyPlay Edits?
          </h2>

          <div className="space-y-4">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/30 transition-all duration-300 hover:border-primary/50"
              >
                <div className="p-2 rounded-full bg-primary/20 text-primary">
                  <Check className="w-4 h-4" />
                </div>
                <p className="text-foreground font-medium">{reason.text}</p>
                <div className="text-primary">{reason.icon}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/30">
            <p className="text-lg text-foreground">
              אם אתם מחפשים מישהו שמבין את עולם המיינקראפט וייקח את הסרטונים שלכם לרמה הבאה – הגעתם למקום הנכון! 🚀
            </p>
            <p className="text-xl font-bold text-primary mt-4">
              בואו נתחיל ליצור יחד! 🎬
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
