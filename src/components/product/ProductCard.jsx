"use client";

import Link from "next/link";
import { Heart, Eye, ShoppingCart, Star } from "lucide-react";

export default function ProductCard({ product }) {
  const discount =
    product.salePrice && product.salePrice > 0
      ? Math.round(
          ((product.price - product.salePrice) / product.price) * 100
        )
      : 0;

  return (
    <div className="group bg-white rounded-2xl border hover:shadow-xl transition-all duration-300 overflow-hidden">

      {/* Image */}
      <div className="relative bg-gray-50 h-60 flex items-center justify-center">

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}

        <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center hover:bg-red-500 hover:text-white transition">
          <Heart size={18} />
        </button>

        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="h-48 object-contain group-hover:scale-110 transition duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">

        <p className="text-xs text-orange-600 font-semibold uppercase">
          {product.brand || "Brand"}
        </p>

        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold mt-2 line-clamp-2 hover:text-orange-600 transition">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-3">

          {[1,2,3,4,5].map((i)=>(
            <Star
              key={i}
              size={14}
              className="fill-yellow-400 text-yellow-400"
            />
          ))}

          <span className="text-xs text-gray-500 ml-1">
            ({product.reviews || 0})
          </span>

        </div>

        {/* Price */}

        <div className="flex items-center gap-2 mt-3">

          <span className="text-xl font-bold text-black">

            ₹{product.salePrice || product.price}

          </span>

          {product.salePrice > 0 && (

            <span className="line-through text-gray-400">

              ₹{product.price}

            </span>

          )}

        </div>

        {/* Stock */}

        <div className="mt-2">

          {product.stock > 0 ? (

            <span className="text-green-600 text-sm font-medium">

              In Stock

            </span>

          ) : (

            <span className="text-red-600 text-sm font-medium">

              Out of Stock

            </span>

          )}

        </div>

        {/* Buttons */}

        <div className="grid grid-cols-2 gap-2 mt-5">

          <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 flex justify-center items-center gap-2">

            <ShoppingCart size={18}/>

            Cart

          </button>

          <Link
            href={`/products/${product._id}`}
            className="border rounded-xl py-3 flex justify-center items-center gap-2 hover:bg-gray-100"
          >

            <Eye size={18}/>

            View

          </Link>

        </div>

      </div>

    </div>
  );
}