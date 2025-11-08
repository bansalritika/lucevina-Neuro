import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Microscope, Dna } from "lucide-react";

const ScienceSection = () => {
  const scienceFeatures = [
    {
      icon: Brain,
      title: "Neuroscience Research",
      description: "Our laboratory harnesses cutting-edge neuroscience to understand how the brain communicates with skin cells, creating revolutionary skincare solutions."
    },
    {
      icon: Microscope,
      title: "Advanced Technology", 
      description: "Using proprietary molecular technology, we develop formulations that work at the cellular level to optimize skin regeneration and renewal."
    },
    {
      icon: Dna,
      title: "Cellular Innovation",
      description: "Our breakthrough peptide complexes target specific cellular pathways, enhancing the skin's natural ability to repair and rejuvenate itself."
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary/10 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
              The Science Behind Beauty
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-luxury font-bold mb-6">
              Where{" "}
              <span className="luxury-text">Innovation</span>{" "}
              meets Elegance
            </h2>
            
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              At NEURAÉ, we believe that true beauty comes from understanding 
              the intricate relationship between mind and skin. Our research 
              team combines decades of neuroscience expertise with luxury 
              skincare craftsmanship.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold mb-1">15+ Years of Research</h4>
                  <p className="text-sm text-foreground/60">
                    Continuous innovation in neuroscience-based skincare
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold mb-1">Clinical Validation</h4>
                  <p className="text-sm text-foreground/60">
                    All formulations are rigorously tested and clinically proven
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <h4 className="font-semibold mb-1">Sustainable Innovation</h4>
                  <p className="text-sm text-foreground/60">
                    Ethical research practices with environmental consciousness
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Science Cards */}
          <div className="space-y-6">
            {scienceFeatures.map((feature, index) => (
              <Card 
                key={feature.title}
                className="glass-morphism border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-foreground/70 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScienceSection;