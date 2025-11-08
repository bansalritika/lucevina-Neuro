import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // ✅ connect to the Category model
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
