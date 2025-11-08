import { useState, useEffect } from "react";
import { ChevronRight, Star, Minus, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl mb-4">Product not found</h1>
          <Link
            to="/products"
            className="text-muted-foreground hover:text-foreground underline"
          >
            Return to products
          </Link>
        </div>
      </div>
    );
  }

  const imageSrc = product.images?.[0]
    ? product.images[0].startsWith("http")
      ? product.images[0]
      : `${API_URL}/${product.images[0]}`
    : "/placeholder.svg";

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Lucevina
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-foreground transition-colors">
            Our Products
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{product.title}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          {/* Product Image */}
          <div className="relative">
            <div className="sticky top-24">
              {product.badge && (
                <Badge
                  variant={product.badge === "NEW" ? "default" : "secondary"}
                  className="absolute top-4 right-4 z-10"
                >
                  {product.badge === "NEW" ? "NEWNESS" : "AWARD WINNING"}
                </Badge>
              )}
              <div className="aspect-square bg-card rounded-lg overflow-hidden">
                <img
                  src={imageSrc}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <p className="text-xs tracking-widest text-muted-foreground mb-2">
                harmonie
              </p>
              <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-2">
                {product.title}<br/>{product.subtitle}
              </h2>

              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < 4 ? "fill-foreground" : "fill-muted"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground">4.9 (72 reviews)</span>
              </div>

              <p className="text-2xl font-light">${product.price}</p>
            </div>

            <p className="leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm">Quantity</span>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-secondary transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-secondary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button className="w-full py-6 text-base tracking-wider">
              ADD TO BAG — ${product.price * quantity}
            </Button>

            {/* Product Details Tabs */}
            <Tabs defaultValue="benefits" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="responsibilty">Responsibility</TabsTrigger>
              </TabsList>

              <TabsContent value="benefits" className="pt-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.benefits || "This product offers numerous benefits to enhance your well-being and beauty."}
                </p>
              </TabsContent>

              <TabsContent value="ingredients" className="pt-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.ingredients || "More details about the product will appear here."}
                </p>
              </TabsContent>

              <TabsContent value="responsibilty" className="pt-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.responsibilty || "Apply gently as per requirement. Use daily for best results."}
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
