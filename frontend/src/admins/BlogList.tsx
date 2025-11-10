import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
  content: string[];
}

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
  fetch(`${API_URL}/blogs`, { credentials: "include" })
    .then((res) => res.json())
    .then((data) => setBlogs(data))
    .catch(() => toast.error("Failed to load blogs"));
}, []);

const handleDelete = async (id: string) => {
  await fetch(`${API_URL}/blogs/${id}`, {
    method: "DELETE",
    headers: {
    Authorization: `Bearer ${adminToken}`,
  },
    credentials: "include"
  });

  setBlogs((prev) => prev.filter((b) => b._id !== id));
  toast.success("Blog deleted");
};

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif mb-2">Blog Management</h1>
            <p className="text-muted-foreground">Manage your blog posts</p>
          </div>
          <Link to="/admin/blogs/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {blogs.map((blog) => (
            <Card key={blog._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl">{blog.title}</CardTitle>
                      <Badge variant="secondary">{blog.category}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{blog.excerpt}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{blog.author}</span>
                      <span>•</span>
                      <span>{blog.date}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link to={`/admin/blogs/edit/${blog._id}`}>
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteId(blog._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this blog post? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminBlogList;
