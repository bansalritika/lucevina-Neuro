import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
  featured?: boolean;
}

const categories = ["All", "Ingredients", "Routines", "Wellness", "Tips", "Science"];

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;

  // ✅ Fetch blogs from backend
  useEffect(() => {
    fetch(`${API_BASE}/blogs`)
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch(() => toast.error("Failed to load blog posts"));
  }, []);

  // ✅ Filter by category + search
  const filteredPosts = blogs.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // ✅ Featured blog from backend
  const featuredPost = blogs.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="container mx-auto px-4 py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-5xl font-light tracking-[0.2em] mb-4">
            JOURNAL
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Insights on skincare science, ingredients, and wellness from our experts
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === "All" && !searchQuery && (
          <Link to={`/blog/${featuredPost._id}`}>
            <div className="relative h-[500px] rounded-lg overflow-hidden mb-16 group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 z-20">
                <Badge className="mb-4">{featuredPost.category}</Badge>
                <h2 className="text-3xl lg:text-4xl font-light tracking-wider mb-4 max-w-3xl">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-4 max-w-2xl">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{featuredPost.author}</span>
                  <span>•</span>
                  <span>
                    {new Date(featuredPost.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Search + Category Filter */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* SEARCH */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* CATEGORY BUTTONS */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm tracking-wider transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Link key={post._id} to={`/blog/${post._id}`}>
              <article className="group cursor-pointer">
                <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <Badge className="mb-3">{post.category}</Badge>

                <h3 className="text-xl font-light tracking-wider mb-3 group-hover:opacity-70 transition-opacity">
                  {post.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No articles found matching your criteria.
            </p>
          </div>
        )}
      </main>

      <NewsletterSection />
    </div>
  );
};

export default Blog;
