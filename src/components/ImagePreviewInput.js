"use client";

import { useState } from "react";

export default function ImagePreviewInput({ defaultValue = "" }) {
  const [image, setImage] = useState(defaultValue);

  return (
    <div>
      <input
        name="image"
        placeholder="Image URL"
        className="border p-3 rounded-lg w-full"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      {image && (
        <img
          src={image}
          alt="Preview"
          className="mt-3 w-40 h-40 object-cover rounded-xl border"
        />
      )}
    </div>
  );
}