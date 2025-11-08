import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Import your images
import img1 from "../assets/hero1.jpg";
import img2 from "../assets/hero2.jpg";
import img3 from "../assets/hero3.png";

const slides = [
  {
    image: img1,
    badge: "Replenish & Renew",
    title: "For a «WOW» effect upon waking",
    description:
      "Night after night, the Harmonie Sleeping Mask regenerates and strengthens the skin.",
    buttonText: "Discover our skincare product",
    link: "/ourproducts",
  },
  {
    image: img2,
    badge: "Glowing Skin Routine",
    title: "Wake up to radiant, youthful glow",
    description:
      "Our advanced night care deeply nourishes your skin while you rest.",
    buttonText: "Discover our skincare product",
    link: "/ourproducts",
  },
  {
    image: img3,
    badge: "Hydration Redefined",
    title: "Let your skin breathe again",
    description:
      "Experience the lightweight luxury of hydration with our new range.",
    buttonText: "Discover our skincare product",
    link: "/ourproducts",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto change slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background top-[-64px]">
      {/* Background Images with fade + smooth zoom animation */}
      <div className="absolute inset-0">
        {slides.map((item, index) => (
          <img
            key={index}
            src={item.image}
            alt={`slide-${index}`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1500ms] ease-in-out
              ${index === currentSlide ? "opacity-100 animate-zoom" : "opacity-0"}
            `}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          key={slide.title}
          className="max-w-3xl mx-auto transition-opacity duration-700 ease-in-out"
        >
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 mb-8 bg-background/20 backdrop-blur-sm border border-border/30 rounded-full">
            <span className="text-xs font-medium tracking-[0.2em] text-foreground uppercase">
              {slide.badge}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-luxury font-bold leading-tight mb-8">
            {slide.title}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-foreground/80 mb-10 leading-relaxed max-w-2xl mx-auto"
          style={{fontFamily: "ibmplexmono, Courier New, serif" }}>
            {slide.description}
          </p>

          {/* CTA Button */}
          <Link
          to={slide.link}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wide px-4 py-2 rounded-2xl inline-block transition-colors"
          >
            {slide.buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
