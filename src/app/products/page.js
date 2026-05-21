"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.log("Product fetch error:", error);
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

  let filtered = products.filter((item) => {
    const matchSearch = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "All" || item.category === category;

    return matchSearch && matchCategory;
  });

  if (sort === "price-low") {
    filtered = filtered.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (sort === "price-high") {
    filtered = filtered.sort((a, b) => Number(b.price) - Number(a.price));
  }

  if (sort === "stock-low") {
    filtered = filtered.sort((a, b) => Number(a.stock) - Number(b.stock));
  }

  if (sort === "stock-high") {
    filtered = filtered.sort((a, b) => Number(b.stock) - Number(a.stock));
  }

  if (loading) {
    return <p className="p-6">Loading products...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Electric Products ⚡</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            placeholder="Search product..."
            className="border p-3 rounded-lg"
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
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="price-low">Price Low to High</option>
            <option value="price-high">Price High to Low</option>
            <option value="stock-low">Stock Low to High</option>
            <option value="stock-high">Stock High to Low</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <Link href={`/products/${item._id}`} key={item._id}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 h-full">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="h-40 w-full object-cover rounded-lg"
                />

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {item.category}
                  </span>

                  {Number(item.stock) < 5 && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                      Low Stock
                    </span>
                  )}
                </div>

                <h2 className="mt-3 font-semibold">{item.name}</h2>
                <p className="text-lg font-bold">₹{item.price}</p>
                <p className="text-sm text-gray-500">Stock: {item.stock}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}