import express from "express";

const router = express.Router();
// const multer = require("multer");
// const path = require("path");
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({}).lean();
    res.json(categories);
  } catch (err) { 
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/product", async (req, res) => {
  try {
    const products = await Product.find({ categoryId: req.params.id, isApproved: true })
      .populate("categoryId subcategoryId", "title name");
      if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }
    res.json({products});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add new
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, categoryType } = req.body;

    if (!title || !description || !categoryType) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newCat = new Category({
      title,
      description,
      categoryType,
      userId: req.user._id,
    });

    await newCat.save();
    res.status(201).json(newCat);
  } catch (err) {
    console.error("Category creation error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});


// Update
router.put("/:id", protect, adminOnly, async (req, res) => {
  const { title, description, categoryType } = req.body;
  const updateData = { title, description, categoryType };
  const updated = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(updated);
});

// Delete
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;