import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProductShowcase = () => {
  const products = [
    {
      title: "The harmonie Sleeping Mask",
      category: "Night Care",
      description: "Revolutionary neuroscience-based night treatment that regenerates skin while you sleep.",
      benefits: ["Cellular regeneration", "Deep hydration", "Anti-aging"],
      isNew: true
    },
    {
      title: "Neuro-Lifting Serum",
      category: "Daily Care",
      description: "Advanced peptide complex that targets muscle memory for lifted, firm skin.",
      benefits: ["Instant lifting", "Muscle relaxation", "Firming"],
      isNew: false
    },
    {
      title: "Cognitive Eye Cream",
      category: "Eye Care", 
      description: "Intelligent eye treatment that adapts to your skin's circadian rhythm.",
      benefits: ["Dark circle reduction", "Puffiness relief", "Brightness"],
      isNew: true
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Our Science
          </Badge>
          <h2 className="text-4xl md:text-5xl font-luxury font-bold mb-6">
            Neuroscience meets{" "}
            <span className="luxury-text">Beauty</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Experience the future of skincare with our revolutionary products 
            that harness the power of neuroscience for unprecedented results.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card 
              key={product.title} 
              className="group glass-morphism border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                {/* Product Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-primary font-medium mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-xl font-luxury font-semibold">
                      {product.title}
                    </h3>
                  </div>
                  {product.isNew && (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      New
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <p className="text-foreground/70 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Benefits */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2 text-primary">Key Benefits:</p>
                  <ul className="space-y-1">
                    {product.benefits.map((benefit) => (
                      <li key={benefit} className="text-sm text-foreground/70 flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Button 
                  variant="outline" 
                  className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            Explore All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;