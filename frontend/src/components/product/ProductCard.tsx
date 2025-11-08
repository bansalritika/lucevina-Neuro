import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = import.meta.env.VITE_API_URL;

export function ProductCard({ product, className = "" }) {

  const emotionCategory = product.categories?.find(
    (cat) => cat.categoryType === "By Emotion"
  );

  const imageSrc =
    product.images?.[0]
      ? product.images[0].startsWith("http")
        ? product.images[0]
        : `${API_URL}/${product.images[0]}`
      : "/placeholder.svg";

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group ${className}`}
    >
      <Link to={`/product/${product._id}`}>
        <Card className="bg-black text-white h-[500px] lg:h-[600px] flex flex-col hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4 h-full flex flex-col text-center">

            {/* Product Info */}
            <div className="text-sm italic mb-1">{emotionCategory ? emotionCategory.title : "—"}</div>
            <h3 className="font-luxury text-lg font-semibold mb-1">
              {product.title}
            </h3>
            {product.subtitle && (
              <p className="text-sm italic mb-3">{product.subtitle}</p>
            )}
            <div className="text-lg font-semibold">${product.price || 0}</div>

            {/* Product Image */}
            <div className="flex-1 overflow-hidden rounded-lg mb-4">
              <img
                src={imageSrc}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
