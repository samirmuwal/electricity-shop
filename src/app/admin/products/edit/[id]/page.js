"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

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

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products`);
      const data = await res.json();

      const product = data.products.find((p) => p._id === params.id);

      if (product) {
        const cleanProduct = {
          name: product.name || "",
          brand: product.brand || "",
          category: product.category || "",
          price: product.price || "",
          stock: product.stock || "",
          watt: product.watt || "",
          voltage: product.voltage || "",
          description: product.description || "",
          image: product.image || "",
        };

        setForm(cleanProduct);
        setPreview(product.image || "");
      }
    };

    fetchProduct();
  }, [params.id]);

  function handleImageChange(file) {
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  const uploadImage = async () => {
    if (!imageFile) return form.image;

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.imageUrl;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const imageUrl = await uploadImage();

    await fetch(`/api/products/${params.id}`, {
      method: "PUT",
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
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            className="w-full border p-3 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Brand</label>
          <input
            className="w-full border p-3 rounded"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            className="w-full border p-3 rounded"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            className="w-full border p-3 rounded"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Stock</label>
          <input
            type="number"
            className="w-full border p-3 rounded"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Watt</label>
          <input
            className="w-full border p-3 rounded"
            value={form.watt}
            onChange={(e) => setForm({ ...form, watt: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Voltage</label>
          <input
            className="w-full border p-3 rounded"
            value={form.voltage}
            onChange={(e) => setForm({ ...form, voltage: e.target.value })}
          />
        </div>

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
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}