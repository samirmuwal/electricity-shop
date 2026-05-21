export const dynamic = "force-dynamic";
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
        {["name", "brand", "category", "price", "stock", "watt", "voltage"].map(
          (key) => (
            <div key={key}>
              <label className="block mb-1 font-medium capitalize">{key}</label>
              <input
                className="w-full border p-3 rounded"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
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
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}