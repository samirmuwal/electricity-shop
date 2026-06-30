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
  sku: "",

  brand: "",
  category: "",
  subCategory: "",

  price: "",
  salePrice: "",

  stock: "",

  watt: "",
  voltage: "",
  warranty: "",

  description: "",

  image: "",

  featured: false,
  bestSeller: false,
  newArrival: true,

  tags: "",
});
const [brands, setBrands] = useState([]);
 useEffect(() => {
  async function loadData() {
    try {
      const [categoryRes, brandRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/brands"),
      ]);

      const categoryData = await categoryRes.json();
      const brandData = await brandRes.json();

      setCategories(categoryData.categories || []);
      setBrands(brandData.brands || []);
    } catch (err) {
      console.log(err);
    }
  }

  loadData();
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
  placeholder="SKU (Example: SW-1001)"
  className="w-full border p-3 rounded-lg"
  value={form.sku}
  onChange={(e) =>
    setForm({ ...form, sku: e.target.value })
  }
/>

       <select
  className="w-full border p-3 rounded-lg"
  value={form.brand}
  onChange={(e) =>
    setForm({ ...form, brand: e.target.value })
  }
>
  <option value="">Select Brand</option>

  {brands.map((brand) => (
    <option
      key={brand._id}
      value={brand.name}
    >
      {brand.name}
    </option>
  ))}
</select>

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
  placeholder="Sale Price"
  className="w-full border p-3 rounded-lg"
  value={form.salePrice}
  onChange={(e) =>
    setForm({ ...form, salePrice: e.target.value })
  }
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
  <input
  placeholder="Warranty (Example: 2 Years)"
  className="w-full border p-3 rounded-lg"
  value={form.warranty}
  onChange={(e) =>
    setForm({ ...form, warranty: e.target.value })
  }
/>
        <ImageUploadInput
          preview={preview}
          onFileChange={handleImageChange}
        />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

  <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer">
    <input
      type="checkbox"
      checked={form.featured}
      onChange={(e) =>
        setForm({ ...form, featured: e.target.checked })
      }
    />
    <span>Featured Product</span>
  </label>

  <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer">
    <input
      type="checkbox"
      checked={form.bestSeller}
      onChange={(e) =>
        setForm({ ...form, bestSeller: e.target.checked })
      }
    />
    <span>Best Seller</span>
  </label>

  <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer">
    <input
      type="checkbox"
      checked={form.newArrival}
      onChange={(e) =>
        setForm({ ...form, newArrival: e.target.checked })
      }
    />
    <span>New Arrival</span>
  </label>

</div>
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