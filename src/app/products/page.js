"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products", {
          cache: "no-store",
        });

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
    const matchCategory =
      category === "All" || item.category === category;

    let matchStock = true;

    if (stockFilter === "in-stock") {
      matchStock = Number(item.stock) > 0;
    }

    if (stockFilter === "out-of-stock") {
      matchStock = Number(item.stock) === 0;
    }

    return matchCategory && matchStock;
  });

  if (sort === "price-low") {
    filtered = [...filtered].sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
  }

  if (sort === "price-high") {
    filtered = [...filtered].sort(
      (a, b) => Number(b.price) - Number(a.price)
    );
  }

  if (sort === "stock-low") {
    filtered = [...filtered].sort(
      (a, b) => Number(a.stock) - Number(b.stock)
    );
  }

  if (sort === "stock-high") {
    filtered = [...filtered].sort(
      (a, b) => Number(b.stock) - Number(a.stock)
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-14 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Products ⚡</h1>

        <div className="flex flex-col sm:flex-row gap-3">
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

          <select
            className="border p-3 rounded-lg"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="All">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto mb-4 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full border text-sm transition ${
              category === cat
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-gray-600 mb-6">
        {filtered.length} products found
      </p>

      {filtered.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 flex-col md:flex-row gap-6">
          {filtered.map((item) => (
            <Link
              href={`/products/${item._id}`}
              key={item._id}
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 h-[420px] flex flex-col">
                <div className="h-[220px] w-full bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                </div>

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

                <h2 className="mt-3 font-semibold min-h-[48px] line-clamp-2">
                  {item.name}
                </h2>

                <div className="mt-auto">
                  <p className="text-lg font-bold">
                    ₹{item.price}
                  </p>

                  <p className="text-sm text-gray-500">
                    Stock: {item.stock}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}