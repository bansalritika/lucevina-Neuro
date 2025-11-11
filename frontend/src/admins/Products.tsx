import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Edit2, Trash2 } from "lucide-react";

type CategoryType = "By Product Type" | "By Concern" | "By Emotion";

interface Category {
  _id: string;
  title: string;
  description: string;
  images: string;
  categoryType: CategoryType;
}

interface Product {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  featured: boolean;
  images: string[];
  categories: Category[];
}

interface ProductForm {
  title: string;
  subtitle: string;
  description: string;
  price: string;
  discount: string;
  stock: string;
  featured: boolean;
  images: (string | File)[];
  mainTypes: CategoryType[];
  selectedCategories: Record<CategoryType, string[]>;
}

const CATEGORY_TYPES: CategoryType[] = [
  "By Product Type",
  "By Concern",
  "By Emotion",
];

export default function Products() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>({
    title: "",
    subtitle: "",
    description: "",
    price: "",
    discount: "",
    stock: "",
    featured: false,
    images: [],
    mainTypes: [],
    selectedCategories: {
      "By Product Type": [],
      "By Concern": [],
      "By Emotion": [],
    },
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("adminToken");

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          fetch(`${API_URL}/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const [catData, prodData] = await Promise.all([
          catRes.json(),
          prodRes.json(),
        ]);
        setCategories(catData);
        setProducts(prodData);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + form.images.length > 5) {
    toast({
      title: "Limit exceeded",
      description: "You can upload up to 5 images only.",
      variant: "destructive",
    });
    return;
  }
  setForm({ ...form, images: [...form.images, ...files] });
  };

  // Toggle main category
  const toggleMainType = (type: CategoryType) => {
    setForm((prev) => {
      const updated = prev.mainTypes.includes(type)
        ? prev.mainTypes.filter((t) => t !== type)
        : [...prev.mainTypes, type];
      return { ...prev, mainTypes: updated };
    });
  };

  // Toggle subcategory
  const toggleSubCategory = (type: CategoryType, id: string) => {
    setForm((prev) => {
      const updated = prev.selectedCategories[type].includes(id)
        ? prev.selectedCategories[type].filter((c) => c !== id)
        : [...prev.selectedCategories[type], id];
      return {
        ...prev,
        selectedCategories: { ...prev.selectedCategories, [type]: updated },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.subtitle || !form.price || form.images.length === 0 || form.mainTypes.length === 0) {
      toast({
        title: "Missing fields",
        description: "Please fill all fields including at least one image and main category type",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subtitle", form.subtitle);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("discount", form.discount);
    formData.append("stock", form.stock);
    formData.append("featured", form.featured ? "true" : "false");
    form.images.forEach((img) => {
      formData.append("images", img);
    });
    const selected = Object.values(form.selectedCategories).flat();
    formData.append("categories", JSON.stringify(selected));
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/products/${editId}` : `${API_URL}/products`;
    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const refreshed = await fetch(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(await refreshed.json());
        toast({
          title: editId ? "Product Updated" : "Product Added",
          description: "Successfully saved product",
        });
        setForm({
          title: "",
          subtitle: "",
          description: "",
          price: "",
          discount: "",
          stock: "",
          featured: false,
          images: [],
          mainTypes: [],
          selectedCategories: {
            "By Product Type": [],
            "By Concern": [],
            "By Emotion": [],
          },
        });
        setEditId(null);
      }
      else {
        toast({
          title: "Error",
          description: "Failed to save product",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEdit = (prod: Product) => {
    const selectedCategories: Record<CategoryType, string[]> = {
      "By Product Type": [],
      "By Concern": [],
      "By Emotion": [],
    };
    prod.categories.forEach((c) => {
      selectedCategories[c.categoryType].push(c._id);
    });

    setEditId(prod._id);
    setForm({
      title: prod.title,
      subtitle: prod.subtitle,
      description: prod.description,
      price: prod.price.toString(),
      discount: prod.discount.toString(),
      stock: prod.stock.toString(),
      featured: prod.featured,
      images: prod.images,
      mainTypes: Array.from(new Set(prod.categories.map((c) => c.categoryType))),
      selectedCategories,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast({ title: "Deleted", description: "Product removed successfully" });
    }
  };

  return (
    <div className="space-y-8 p-6 bg-background min-h-screen">
      <div className="mx-auto space-y-8">
        {/* Form Card */}
        <Card className="glass-morphism p-6 md:p-8 border-border/50">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {editId ? "Update Product" : "Add Product"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter product title"
                name="title"
              />
            </div>

            <div className="space-y-2">
              <Label>Sub Title</Label>
              <Input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Enter product subtitle"
                name="subtitle"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter product description"
                name="description"
              />
            </div>

            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Enter product price"
                name="price"
              />
            </div>

            <div className="space-y-2">
              <Label>Discount %</Label>
              <Input
                type="number"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                placeholder="Enter discount"
                max={99}
                name="discount"
              />
            </div>

            <div className="space-y-2">
              <Label>Stock</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="Enter stock quantity"
                name="stock"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Label htmlFor="featured">Featured Product</Label>
              <Checkbox
                id="featured"
                checked={form.featured}
                onCheckedChange={(value) =>
                  setForm({ ...form, featured: Boolean(value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <Input type="file" accept=".jpg,.jpeg,.png" multiple onChange={handleImageChange} />
              {form.images.length > 0 && (
  <div className="flex flex-wrap gap-3 mt-3">
    {form.images.map((img, i) => (
      <div key={i} className="relative">
        <img
          src={img instanceof File ? URL.createObjectURL(img) : img}
          alt={`Preview ${i}`}
          className="w-24 h-24 object-cover rounded-md border"
        />
        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              images: form.images.filter((_, idx) => idx !== i),
            })
          }
          className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}

            </div>

            {/* Category Type & Subcategory Selection */}
            <div>
              <Label>Main Category Types</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {CATEGORY_TYPES.map((type) => ( 
                  <Button 
                  key={type} 
                  type="button" 
                  variant={ form.mainTypes.includes(type) ? "default" : "outline" } 
                  onClick={() => toggleMainType(type)} 
                  className="border-border/50" >
                    {type}
                  </Button>
                ))} 
              </div>
            </div>
            
            {/* 🟣 Subcategories per selected type */}
            {form.mainTypes.map((type) => { 
              const subCats = categories.filter( (c) => c.categoryType === type );
              return ( 
              <div key={type}>
                <Label>{type} Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {subCats.map((cat) => ( 
                    <Button 
                    key={cat._id} 
                    type="button" 
                    variant={ form.selectedCategories[type]?.includes(cat._id) ? "default" : "outline" } 
                    onClick={() => toggleSubCategory(type, cat._id)} 
                    className="border-border/50" >
                      {cat.title}
                    </Button>
                  ))}
                </div>
              </div>
            );
            })}

            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editId ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{editId ? "Update" : "Add"} Product</>
              )}
            </Button>
          </form>
        </Card>

        {/* Product Table */}
        <Card className="glass-morphism p-6 md:p-8 border-border/50">
          <h3 className="text-xl md:text-2xl font-bold mb-6">All Products</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>SubTitle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <Loader2 className="animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : products.length > 0 ? (
                  products.map((prod) => (
                    <TableRow key={prod._id}>
                      <TableCell>
                        <img
                          src={prod.images?.[0] || "/placeholder.svg"}
                          alt={prod.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </TableCell>
                      <TableCell>{prod.title}</TableCell>
                      <TableCell>{prod.subtitle}</TableCell>
                      <TableCell>{prod.description}</TableCell>
                      <TableCell>${prod.price}</TableCell>
                      <TableCell>{prod.discount}%</TableCell>
                      <TableCell>{prod.stock}</TableCell>
                      <TableCell>{prod.featured ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 text-xs">
                          {prod.categories.map((cat) => (
                            <span
                              key={cat._id}
                              className="px-2 py-1 bg-secondary rounded-md"
                            >
                              {cat.title} ({cat.categoryType})
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(prod)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(prod._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No products found
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
