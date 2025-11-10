import express from "express";
import Blog from "../models/Blog.js";
import slugify from "slugify";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all blogs (with search + category filter)
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;

    const query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } }
      ];
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch {
    res.status(500).json({ message: "Error fetching blog" });
  }
});

// CREATE blog (Admin Only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    if (!Array.isArray(req.body.content)) {
      return res.status(400).json({ message: "Content must be an array" });
    }
    // ✅ Generate a slug from the title
    let slug = slugify(req.body.title || "", { lower: true, strict: true });

    // ✅ Ensure the slug is unique (append a number if duplicate)
    const existing = await Blog.findOne({ slug });
    if (existing) {
      const uniqueSuffix = Date.now().toString().slice(-4); // e.g., "8723"
      slug = `${slug}-${uniqueSuffix}`;
    }

    const blogData = {
      ...req.body,
      slug,
    };
    const blog = await Blog.create(blogData);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE blog (Admin Only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (!Array.isArray(req.body.content)) {
      return res.status(400).json({ message: "Content must be an array" });
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    res.json(blog);
  } catch {
    res.status(500).json({ message: "Error updating blog" });
  }
});

// DELETE blog (Admin Only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch {
    res.status(500).json({ message: "Error deleting blog" });
  }
});

export default router;
