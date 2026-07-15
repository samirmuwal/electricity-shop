"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export default function AdminProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products", {
          cache: "no-store",
        });
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.log("Fetch products error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((item) => item.category).filter(Boolean)),
  ];

  const filtered = products.filter((item) => {
    const text = `${item.name || ""} ${item.brand || ""} ${
      item.category || ""
    }`.toLowerCase();

    const matchSearch = text.includes(search.toLowerCase());
    const matchCategory = category === "All" || item.category === category;

    let matchStock = true;

    if (stockFilter === "Low Stock") {
      matchStock = Number(item.stock) > 0 && Number(item.stock) < 5;
    }

    if (stockFilter === "Out of Stock") {
      matchStock = Number(item.stock) === 0;
    }

    return matchSearch && matchCategory && matchStock;
  });

  if (loading) {
    return <p className="p-6 text-gray-500">Loading products...</p>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          placeholder="Search product, brand, category..."
          className="border p-3 rounded-lg flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-3 rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="border p-3 rounded-lg"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="All">All Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Brand</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="p-3">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg"
                    unoptimized
                  />
                  
                </td>

                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3">{item.brand}</td>
                <td className="p-3">₹{item.price}</td>

                <td className="p-3">
                  {Number(item.stock) === 0 ? (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                      Out of Stock
                    </span>
                  ) : Number(item.stock) < 5 ? (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
                      Low: {item.stock}
                    </span>
                  ) : (
                    <span>{item.stock}</span>
                  )}
                </td>

                <td className="p-3 space-x-3">
                  <Link
                    href={`/admin/products/edit/${item._id}`}
                    className="text-blue-600"
                  >
                    Edit
                  </Link>

                  <DeleteButton id={item._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="p-6 text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
}
