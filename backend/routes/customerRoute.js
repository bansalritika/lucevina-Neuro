import express from "express";
import Customer from "../models/Customer.js"; 
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// =======================
// GET ALL USERS
// =======================
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const customers = await Customer.find().select("-password -resetToken -resetTokenExpires");
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// DELETE USER
// =======================
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await Customer.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
