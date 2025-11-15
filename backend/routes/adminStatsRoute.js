import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ------------------------------------------
   1️⃣  Total Revenue & Profit
------------------------------------------- */
router.get("/revenue", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({ status: "Delivered" });

    let totalRevenue = 0;
    let totalProfit = 0;

    orders.forEach((order) => {
      totalRevenue += order.total;
      totalProfit += order.total * 0.25; // Example profit margin 25%
    });

    res.json({
      totalRevenue,
      totalProfit,
    });

  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ error: "Failed to calculate revenue" });
  }
});


/* ------------------------------------------
   2️⃣  Total Customers
------------------------------------------- */
router.get("/customers", protect, adminOnly, async (req, res) => {
  try {
    const count = await Customer.countDocuments();
    res.json({ totalCustomers: count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});


/* ------------------------------------------
   3️⃣  Total Products
------------------------------------------- */
router.get("/products", protect, adminOnly, async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ totalProducts: count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* ------------------------------------------
    4️⃣  Growth Stats
------------------------------------------- */
router.get("/growth", protect, adminOnly, async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const lastMonth = currentMonth - 1;

    // Revenue (order total sum)
    const thisMonth = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          $expr: { $eq: [{ $month: "$createdAt" }, currentMonth] }
        }
      },
      { $group: { _id: null, revenue: { $sum: "$total" } } }
    ]);

    const prevMonth = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          $expr: { $eq: [{ $month: "$createdAt" }, lastMonth] }
        }
      },
      { $group: { _id: null, revenue: { $sum: "$total" } } }
    ]);

    const revNow = thisMonth[0]?.revenue || 0;
    const revPrev = prevMonth[0]?.revenue || 0;

    const revenueChange =
      revPrev === 0 ? 100 : ((revNow - revPrev) / revPrev) * 100;

    // Customer count
    const totalCustomers = await Customer.countDocuments();
    const lastMonthCustomers = await Customer.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    const customerChange =
      lastMonthCustomers === 0
        ? 100
        : ((totalCustomers - lastMonthCustomers) /
            lastMonthCustomers) *
          100;

    // Product count (static – but change based on creation date)
    const totalProducts = await Product.countDocuments();
    const lastMonthProducts = await Product.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    const productChange =
      lastMonthProducts === 0
        ? 100
        : ((totalProducts - lastMonthProducts) /
            lastMonthProducts) *
          100;

    // Profit = revenue * 25%
    const profitNow = revNow * 0.25;
    const profitPrev = revPrev * 0.25;

    const profitChange =
      profitPrev === 0 ? 100 : ((profitNow - profitPrev) / profitPrev) * 100;

    res.json({
      revenueChange,
      profitChange,
      customerChange,
      productChange,
    });
  } catch (err) {
    console.error("Growth stats error:", err);
    res.status(500).json({ error: "Failed to fetch growth stats" });
  }
});

/* ------------------------------------------
   4️⃣  Monthly Revenue & Profit Chart
------------------------------------------- */
router.get("/monthly-revenue", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.aggregate([
        {
        $match: { status: { $ne: "Cancelled" } }   // 🚀 THIS FIXES YOUR ISSUE
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$total" },
          profit: { $sum: { $multiply: ["$total", 0.25] } },
        },
      },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const formatted = orders.map((m) => ({
      month: monthNames[m._id - 1],
      revenue: m.revenue,
      profit: m.profit,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch monthly revenue" });
  }
});


/* ------------------------------------------
   5️⃣ Product Sales Count (Bar Chart)
------------------------------------------- */
router.get("/product-sales", protect, adminOnly, async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          count: { $sum: "$items.quantity" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.title",
          sales: "$count"
        }
      }
    ]);

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product sales" });
  }
});

export default router;
