import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const API_BASE = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState<any>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
    image: "",
    readTime: "",
    authorBio: "",
    featured: false
  });

  // ✅ Load existing blog if editing
  useEffect(() => {
    if (isEdit) {
      fetch(`${API_BASE}/blogs/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            ...data,
            content: Array.isArray(data.content) 
              ? data.content.join("\n\n")
              : data.content
          });
        })
        .catch(() => toast.error("Failed to load blog"));
    }
  }, [id, isEdit]);

  // ✅ Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert textarea → array of paragraphs
    const contentArray = formData.content
      .split("\n")
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);

    const payload = {
      ...formData,
      date: new Date(formData.date),
      content: contentArray
    };

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `${API_BASE}/blogs/${id}` : `${API_BASE}/blogs`;
    const adminToken = localStorage.getItem("adminToken");
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
       },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      toast.success(isEdit ? "Blog updated" : "Blog created");
      navigate("/admin/blogs");
    } else {
      toast.error("Error saving blog");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button variant="ghost" className="mb-6" onClick={() => navigate("/admin/blogs")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog List
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-serif">
              {isEdit ? "Edit Blog Post" : "Create New Blog Post"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} required rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (each paragraph separated by a blank line)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={12}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorBio">Author Bio</Label>
                <Textarea
                  id="authorBio"
                  name="authorBio"
                  value={formData.authorBio}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                />
                <Label htmlFor="featured">Featured Blog</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Ingredients">Ingredients</SelectItem>
                      <SelectItem value="Routines">Routines</SelectItem>
                      <SelectItem value="Wellness">Wellness</SelectItem>
                      <SelectItem value="Tips">Tips</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Input name="author" value={formData.author} onChange={handleChange} placeholder="Author" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <Input name="readTime" value={formData.readTime} onChange={handleChange} placeholder="5 min read" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" value={formData.image} onChange={handleChange} required />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  {isEdit ? "Update Post" : "Create Post"}
                </Button>
                <Button variant="outline" type="button" onClick={() => navigate("/admin/blogs")}>
                  Cancel
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogForm;
