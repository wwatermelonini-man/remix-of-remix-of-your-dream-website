import { useSiteContent } from "@/hooks/useSiteContent";
import heroLogoDefault from "@/assets/hero-logo.png";

const HeroSection = () => {
  const { content } = useSiteContent();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Additional floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-foreground/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <div className="animate-float mb-8">
          <img
            src={content.heroLogo || heroLogoDefault}
            alt="CrazyPlay Edits"
            className="w-48 h-48 md:w-64 md:h-64 mx-auto drop-shadow-2xl rounded-2xl"
          />
        </div>
        
        <h1 
          className="text-5xl md:text-7xl font-extrabold mb-4 text-foreground tracking-tight"
          style={{ fontFamily: `'${content.fontFamily}', sans-serif` }}
        >
          <span className="text-primary glow-text">{content.heroTitle}</span>
          <span className="text-accent">{content.heroTitleAccent}</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
          {content.heroSubtitle}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
