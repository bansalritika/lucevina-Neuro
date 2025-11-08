import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import auth from "./routes/auth.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// const createAdmin = async () => { 
//   const adminEmail = process.env.EMAIL_USER;
//   const existingAdmin = await Admin.findOne({ email: adminEmail });

//   if (!existingAdmin) {
//     const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10); // change password
//     await Admin.create({
//       userName: "Company",
//       mainId: "ADMIN",
//       email: adminEmail,
//       password: hashedPassword,  
//       role: "admin"
//     });
//     console.log("✅ Admin account created");
//   } else {
//     console.log("✅ Admin account already exists");
//   }
// };
// createAdmin();

// Routes

app.use("/api/authcustom", authRoute);
app.use("/api/auth", auth);
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);

// Sample route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
