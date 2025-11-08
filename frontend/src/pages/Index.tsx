import TopBanner from "@/components/TopBanner";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import NeuroscienceSection from "@/components/NeuroscienceSection";
import CollectionsSection from "@/components/CollectionsSection";
import RoutineFinderSection from "@/components/RoutineFinderSection";
import QuoteSection from "@/components/QuoteSection";
import NewsletterSection from "@/components/NewsletterSection";
import { useState } from "react";

const Index = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  return (
    <div className="min-h-screen bg-background">
      {isBannerVisible && (
        <TopBanner onClose={() => setIsBannerVisible(false)} />
      )}
      <Navigation isBannerVisible={isBannerVisible} />
      <main>
        <HeroSection />
        <ProductGrid />
        <NeuroscienceSection />
        <CollectionsSection />
        <RoutineFinderSection />
        <QuoteSection />
        <NewsletterSection />
      </main>
    </div>
  );
};

export default Index;
