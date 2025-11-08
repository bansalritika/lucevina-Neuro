import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const TopBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-background border-b border-border text-center py-3 px-4 text-xs tracking-wide">
      <span className="text-foreground/80">
        SAVE 10% ON YOUR ORDER WHEN YOU SUBSCRIBE TO OUR NEWSLETTER{" "}
        <a href="#newsletter" className="underline hover:no-underline">
          SIGN UP
        </a>
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default TopBanner;
