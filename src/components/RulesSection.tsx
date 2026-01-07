import { ScrollText } from "lucide-react";
import { useRules } from "@/hooks/useRules";
import { useSiteContent } from "@/hooks/useSiteContent";

const RulesSection = () => {
  const { rules, loading } = useRules();
  const { content } = useSiteContent();

  if (loading) {
    return (
      <section id="rules" className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">טוען חוקים...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="rules" className="relative py-20 px-4">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <h2
          className="section-title text-center mb-10"
          style={{ fontFamily: `'${content.fontFamily}', sans-serif` }}
        >
          {rules.title}
        </h2>

        <div className="minecraft-card">
          <div className="space-y-4">
            {rules.rules.map((rule, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50 transition-all duration-300 hover:bg-secondary/50 hover:border-primary/30"
              >
                <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                  <ScrollText className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold text-lg">
                    {index + 1}.
                  </span>
                  <p className="text-foreground">{rule}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;
