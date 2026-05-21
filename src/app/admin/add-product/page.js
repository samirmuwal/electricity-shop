"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function AddProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    watt: "",
    voltage: "",
    description: "",
    image: "",
  });

  function handleImageChange(file) {
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  const uploadImage = async () => {
    if (!imageFile) return "";

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const imageUrl = await uploadImage();

    await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        image: imageUrl,
      }),
    });

    setLoading(false);
    router.push("/admin/products");
  };

  return (
    <div className="max-w-2xl bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "brand", "category", "price", "stock", "watt", "voltage"].map(
          (key) => (
            <input
              key={key}
              placeholder={key}
              className="w-full border p-3 rounded capitalize"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          )
        )}

        <ImageUploadInput preview={preview} onFileChange={handleImageChange} />

        <textarea
          placeholder="Description"
          className="w-full border p-3 rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded"
        >
          {loading ? "Uploading..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}