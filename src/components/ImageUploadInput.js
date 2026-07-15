"use client";
 import Image from "next/image";
export default function ImageUploadInput({ preview, onFileChange }) {
  return (
    <div>
      <label className="block mb-1 font-medium">Product Image</label>

      <input
        type="file"
        accept="image/*"
        className="w-full border p-3 rounded"
        onChange={(e) => onFileChange(e.target.files[0])}
      />

      {preview && (
        <Image
          src={preview}
          alt="Preview"
          width={128}
          height={128}
          className="w-32 h-32 object-cover rounded"
          unoptimized
        />
      )}
    </div>
  );
}
