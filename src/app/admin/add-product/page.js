"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function AddProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();

        setCategories(data.categories || []);
      } catch (error) {
        console.log("Category fetch error:", error);
      }
    }

    fetchCategories();
  }, []);

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
    <div className="max-w-2xl bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Product Name"
          className="w-full border p-3 rounded-lg"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Brand"
          className="w-full border p-3 rounded-lg"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />

        {/* Category Dropdown */}
        <select
          className="w-full border p-3 rounded-lg"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>

          {categories.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Price"
          className="w-full border p-3 rounded-lg"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          type="number"
          placeholder="Stock"
          className="w-full border p-3 rounded-lg"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <input
          placeholder="Watt"
          className="w-full border p-3 rounded-lg"
          value={form.watt}
          onChange={(e) => setForm({ ...form, watt: e.target.value })}
        />

        <input
          placeholder="Voltage"
          className="w-full border p-3 rounded-lg"
          value={form.voltage}
          onChange={(e) => setForm({ ...form, voltage: e.target.value })}
        />

        <ImageUploadInput
          preview={preview}
          onFileChange={handleImageChange}
        />

        <textarea
          placeholder="Description"
          className="w-full border p-3 rounded-lg"
          rows={5}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold"
        >
          {loading ? "Uploading..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}