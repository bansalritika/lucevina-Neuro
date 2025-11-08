import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Edit2, Trash2 } from "lucide-react";

const CATEGORY_TYPES = ["By Product Type", "By Concern", "By Emotion"] as const;
type CategoryType = (typeof CATEGORY_TYPES)[number];

interface Category {
  _id: string;
  title: string;
  description: string;
  categoryType: CategoryType;
}

interface CategoryForm {
  title: string;
  description: string;
  categoryType: CategoryType | "";
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [filterType, setFilterType] = useState<CategoryType | "All">("All");
  const [form, setForm] = useState<CategoryForm>({
    title: "",
    description: "",
    categoryType: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const API = `${API_URL}/categories`;
  const token = localStorage.getItem("adminToken");

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter logic
  useEffect(() => {
    if (filterType === "All") setFilteredCategories(categories);
    else setFilteredCategories(categories.filter(cat => cat.categoryType === filterType));
  }, [filterType, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
      setFilteredCategories(data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };


  // Toggle category type (single select)
  const toggleCategoryType = (type: CategoryType) => {
    setForm(prev => ({
      ...prev,
      categoryType: prev.categoryType === type ? "" : type,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.categoryType) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields including category type",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/${editId}` : API;

    try {
      const res = await fetch(url, {
        method,
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ title: "", description: "", categoryType: "" });
        setEditId(null);
        fetchCategories();
        toast({
          title: editId ? "Category Updated" : "Category Added",
          description: `Category has been ${editId ? "updated" : "added"} successfully`,
        });
      } else {
        const err = await res.json().catch(() => ({ message: "Error" }));
        toast({
          title: "Error",
          description: err.message || "Error saving category",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditId(cat._id);
    setForm({
      title: cat.title,
      description: cat.description,
      categoryType: cat.categoryType || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this category?")) return;
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      fetchCategories();
      toast({
        title: "Category Deleted",
        description: "Category has been deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8 p-6 bg-background min-h-screen">
      <div className="mx-auto space-y-8">
        {/* Form Card */}
        <Card className="glass-morphism p-6 md:p-8 border-border/50">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {editId ? "Update" : "Add"} Category
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter category title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter category description"
              />
            </div>

            {/* Category Type Single Select */}
            <div className="space-y-2">
              <Label>Category Type</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_TYPES.map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={form.categoryType === type ? "default" : "outline"}
                    onClick={() => toggleCategoryType(type)}
                    className="border-border/50"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editId ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{editId ? "Update" : "Add"} Category</>
              )}
            </Button>
          </form>
        </Card>

        {/* Filter Section */}
        <div className="flex gap-3 items-center flex-wrap">
          <Label className="text-sm text-muted-foreground">Filter Categories:</Label>
          <Button
            variant={filterType === "All" ? "default" : "outline"}
            onClick={() => setFilterType("All")}
          >
            All
          </Button>
          {CATEGORY_TYPES.map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              onClick={() => setFilterType(type)}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Table Card */}
        <Card className="glass-morphism p-6 md:p-8 border-border/50">
          <h3 className="text-xl md:text-2xl font-bold mb-6">All Categories</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <Loader2 className="animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <TableRow key={cat._id}>
                      <TableCell>{cat.title}</TableCell>
                      <TableCell>{cat.description}</TableCell>
                      <TableCell>{cat.categoryType}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(cat)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(cat._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No categories found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
