import { useState, useEffect } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import { ProductCard } from "@/components/product/ProductCard";

const ProductsPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const catRes = await fetch(`${API_URL}/categories`);
        const catData = await catRes.json();
        const foundCategory = catData.find(
          (cat) => cat.title.toLowerCase() === categoryId?.toLowerCase()
        );
        setCategory(foundCategory);

        // Fetch products
        const prodRes = await fetch(`${API_URL}/products`);
        const prodData = await prodRes.json();

        // Filter products belonging to this category
        const filtered = foundCategory
          ? prodData.filter((p) =>
              p.categories?.some((c) => c._id === foundCategory._id)
            )
          : [];

        setProducts(filtered);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

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
          <Link
            to="/ourproducts"
            className="hover:text-foreground transition-colors"
          >
            Our Products
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground capitalize">
            {categoryId?.replace("-", " ")}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-6 capitalize">
          {category?.title || "Products"}
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          {category?.description ||
            "Explore our curated selection of skincare products designed to nourish, balance, and revitalize your skin."}
        </p>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 pb-24">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground italic py-16">
            No products found in this category.
          </p>
        )}
      </div>

      <NewsletterSection />
    </div>
  );
};

export default ProductsPage;
