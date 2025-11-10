import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { upload } from "../config/cloudinary.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js"; 

const router = express.Router();

/* ======================================================
   🟢 GET ALL PRODUCTS (Admin or Public)
   ====================================================== */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("categories", "title categoryType image")
      .lean();

    res.json(products);
  } catch (err) {
    console.error("Product fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   🟢 GET SINGLE PRODUCT BY ID
   ====================================================== */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categories", "title categoryType");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   🟢 ADD NEW PRODUCT (Admin Only)
   ====================================================== */
router.post("/", protect, adminOnly, upload.array("images", 5), async (req, res) => {
  try {
    const { title, subtitle, description, price, discount, stock, categories } = req.body;

    if (!title || !subtitle || !price || !stock ||!discount || !req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Title, price, and image are required" });
    }

    // Parse category IDs (stringified array)
    let parsedCategories = [];
    if (categories) {
      try {
        parsedCategories = JSON.parse(categories);
      } catch (err) {
        return res.status(400).json({ message: "Invalid categories format" });
      }
    }

    const newProduct = new Product({
      title,
      subtitle,
      description,
      price,
      discount,
      stock,
      images: req.files.map((file) => file.path),
      categories: parsedCategories,
      userId: req.user._id, // ✅ From protect middleware
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Product creation error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

/* ======================================================
   🟠 UPDATE PRODUCT (Admin Only)
   ====================================================== */
router.put("/:id", protect, adminOnly, upload.array("images", 5), async (req, res) => {
  try {
    const { title, subtitle, description, price, discount, stock, categories } = req.body;
    const updateData = { title, subtitle, description, price, discount, stock };

    if (req.file) {
      updateData.images = req.files.map((f) => f.path);
    }

    if (categories) {
      try {
        updateData.categories = JSON.parse(categories);
      } catch {
        return res.status(400).json({ message: "Invalid categories format" });
      }
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("categories", "title categoryType");
    
    res.json(updated);
  } catch (err) {
    console.error("Product update error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

/* ======================================================
   🔴 DELETE PRODUCT (Admin Only)
   ====================================================== */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Product delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
