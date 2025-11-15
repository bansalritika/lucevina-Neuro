import express from "express";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* -------------------------------------------------------
   ADMIN — GET ALL ORDERS
------------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "userName email") // fetch user details
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Admin Fetch Orders Error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/* -------------------------------------------------------
   ADMIN — GET SINGLE ORDER DETAILS
------------------------------------------------------- */
router.get("/single/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("userId", "userName email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    console.error("❌ Admin Order Detail Error:", err);
    res.status(500).json({ error: "Failed to fetch order detail" });
  }
});

/* -------------------------------------------------------
   ADMIN — UPDATE ORDER STATUS
------------------------------------------------------- */
router.put("/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order updated successfully", order });
  } catch (err) {
    console.error("❌ Admin Update Status Error:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

/* -------------------------------------------------------
   ADMIN — DELETE ORDER
------------------------------------------------------- */
router.delete("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    await Order.findByIdAndDelete(orderId);

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("❌ Admin Delete Order Error:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

export default router;
