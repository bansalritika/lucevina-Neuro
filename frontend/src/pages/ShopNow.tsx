import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import NewsLetterSection from "@/components/NewsletterSection";
import { ProductCard } from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Grid, List, SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ShopNow = () => {
  const [allProducts, setAllProducts] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryFromNavbar = params.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(queryFromNavbar);

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const API_URL = import.meta.env.VITE_API_URL;
  const API = `${API_URL}/products`;

  const [categories, setCategories] = useState([]);
  const [mainCategoryType, setMainCategoryType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const CATEGORY_API = `${API_URL}/categories`;

  useEffect(() => {
    setSearchQuery(queryFromNavbar);
  }, [queryFromNavbar]);

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API);
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setAllProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Get dynamic categories from products
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(CATEGORY_API);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);


  const subCategories = useMemo(() => {
    if (mainCategoryType === "all") return [];
    return categories.filter(cat => cat.categoryType === mainCategoryType);
  }, [categories, mainCategoryType]);

  // ✅ Filtering
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesMainCategory =
      mainCategoryType === "all" ||
      product.categories?.some(
        (cat) => cat.categoryType === mainCategoryType
      );

      const matchesCategory =
        selectedCategory === "all" ||
        product.categories?.some(
          (cat) => cat.title === selectedCategory
        );

      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under-100" && product.price < 100) ||
        (priceRange === "100-200" &&
          product.price >= 100 &&
          product.price <= 200) ||
        (priceRange === "200-500" &&
          product.price >= 200 &&
          product.price <= 500) ||
        (priceRange === "over-500" && product.price > 500);

      return matchesSearch && matchesMainCategory && matchesCategory && matchesPrice;
    });

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [allProducts, searchQuery, mainCategoryType, selectedCategory, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Our Products
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our range of neurocosmetics skincare to rebalance your
              skin to be visibly more radiant, firm and smooth.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg rounded-2xl border-2 focus:border-primary/50"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="hidden lg:flex flex-wrap items-center gap-4">
                {/* --- Main Category Type --- */}
                <Select value={mainCategoryType} onValueChange={(value) => {
                  setMainCategoryType(value);
                  setSelectedCategory("all"); // reset subcategory
                }}>
                  <SelectTrigger className="w-48 rounded-xl">
                    <SelectValue placeholder="Main Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Main Types</SelectItem>
                    <SelectItem value="By Product Type">By Product Type</SelectItem>
                    <SelectItem value="By Concern">By Concern</SelectItem>
                    <SelectItem value="By Emotion">By Emotion</SelectItem>
                  </SelectContent>
                </Select>

                {/* --- Subcategory --- */}
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  disabled={mainCategoryType === "all"}
                >
                  <SelectTrigger className="w-48 rounded-xl">
                    <SelectValue placeholder={
                      mainCategoryType === "all" ? "Select main type first" : "Select category"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {mainCategoryType !== "all" ? mainCategoryType : "Categories"}</SelectItem>
                    {subCategories.map(cat => (
                      <SelectItem key={cat._id} value={cat.title}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Price Filter */}
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-48 rounded-xl">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-100">Under $100</SelectItem>
                    <SelectItem value="100-200">$100 - $200</SelectItem>
                    <SelectItem value="200-500">$200 - $500</SelectItem>
                    <SelectItem value="over-500">Over $500</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 rounded-xl">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="title">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Filters - More Filters Dialog */}
              <div className="block lg:hidden">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-xl">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-xl max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Filters</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4">
                      {/* Category Filter */}
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {/* {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))} */}
                        </SelectContent>
                      </Select>

                      {/* Price Filter */}
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Price Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="under-100">Under ₹100</SelectItem>
                          <SelectItem value="100-500">₹100 - ₹500</SelectItem>
                          <SelectItem value="over-500">Over ₹500</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Sort By */}
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="price-low">
                            Price: Low to High
                          </SelectItem>
                          <SelectItem value="price-high">
                            Price: High to Low
                          </SelectItem>
                          <SelectItem value="title">Name A-Z</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* View Toggle */}
              {/* <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-xl"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-xl"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div> */}
            </div>
          </div>

          <Separator />

          {/* Products Grid */}
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-2"
            }
          >
            {paginatedProducts.map((product, index) => {
              // Safe fallback values
              const safeProduct = {
                ...product,
                title: product.title || "No Title",
                images: product.images?.length
                  ? product.images
                  : ["/placeholder.svg"], // add your placeholder image path
                stock: product.stock ?? 0,
                price: product.price ?? 0,
                discount: product.discount ?? 0,
              };

              return (
                <motion.div
                  key={safeProduct._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={safeProduct} />
                </motion.div>
              );
            })}
          </motion.div>

          {/* No Results */}
          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriceRange("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </motion.div>
      </main>
      <NewsLetterSection />
    </div>
  );
};

export default ShopNow;
