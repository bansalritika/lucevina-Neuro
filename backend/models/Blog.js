import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    excerpt: { type: String, required: true },
    category: { 
      type: String, 
      enum: ["Ingredients", "Routines", "Wellness", "Tips", "Science"],
      required: true },
    author: { type: String, required: true },
    authorBio: { type: String, default: "" },
    date: { type: Date, required: true },
    readTime: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: [String], required: true },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
