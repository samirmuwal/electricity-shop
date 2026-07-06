"use client";

import { useState } from "react";

export default function ProductGallery({ product }) {
  const images =
    product.images?.length > 0
      ? product.images
      : [product.image || "/placeholder.png"];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="bg-white rounded-2xl shadow p-5">

      {/* Main Image */}

      <div className="h-[500px] bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">

        <img
          src={selectedImage}
          alt={product.name}
          className="max-h-full object-contain hover:scale-110 transition duration-300"
        />

      </div>

      {/* Thumbnails */}

      <div className="flex gap-3 mt-5 overflow-x-auto">

        {images.map((img, index) => (

          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`w-20 h-20 rounded-lg border overflow-hidden ${
              selectedImage === img
                ? "border-orange-500"
                : "border-gray-200"
            }`}
          >

            <img
              src={img}
              alt=""
              className="w-full h-full object-contain"
            />

          </button>

        ))}

      </div>

    </div>
  );
}