import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BlogPostData {
  _id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch(() => toast.error("Failed to load blog post"));
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Article not found</h1>
          <Link to="/blog">
            <Button variant="outline">Back to Journal</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <article className="container mx-auto px-4 py-12 lg:py-20 max-w-4xl">
        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        {/* Category */}
        <div className="flex items-center justify-between mb-6">
          <Badge>{post.category}</Badge>
        </div>

        {/* Title */}
        <h1 className="text-4xl lg:text-5xl font-light tracking-wider mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>

          <span>•</span>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <span>•</span>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Image */}
        <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden mb-12">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          {post.content.map((p, i) => (
            <p key={i} className="mb-6 text-foreground/90 leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/blog">
            <Button variant="outline" size="lg">
              Read More Articles
            </Button>
          </Link>
        </div>
      </article>
      <NewsletterSection />
    </div>
  );
};

export default BlogPost;
