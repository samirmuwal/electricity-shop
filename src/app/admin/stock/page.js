"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Save, AlertTriangle, AlertOctagon, Check, Search } from "lucide-react";

export default function AdminStockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");

  // Keep track of modified stocks: { productId: stockValue }
  const [modifiedStocks, setModifiedStocks] = useState({});
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleStockChange = (productId, value) => {
    const numericVal = Math.max(0, parseInt(value) || 0);
    setModifiedStocks((prev) => ({
      ...prev,
      [productId]: numericVal,
    }));
  };

  const handleSaveAll = async () => {
    const updates = Object.keys(modifiedStocks).map((id) => ({
      id,
      stock: modifiedStocks[id],
    }));

    if (updates.length === 0) {
      setStatusMessage("No stock changes to save.");
      setTimeout(() => setStatusMessage(""), 3000);
      return;
    }

    setSaving(true);
    setStatusMessage("");

    try {
      const res = await fetch("/api/products/stock", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      const data = await res.json();

      if (data.success) {
        // Update local state
        setProducts((prev) =>
          prev.map((item) =>
            modifiedStocks[item._id] !== undefined
              ? { ...item, stock: modifiedStocks[item._id] }
              : item,
          ),
        );
        setModifiedStocks({});
        setStatusMessage("✅ Stock updated successfully!");
      } else {
        setStatusMessage(`❌ Error: ${data.error || "Failed to update"}`);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Network error. Please try again.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage(""), 5000);
    }
  };

  const filteredProducts = products.filter((item) => {
    const text =
      `${item.name || ""} ${item.brand || ""} ${item.category || ""}`.toLowerCase();
    const matchSearch = text.includes(search.toLowerCase());

    const currentStock =
      modifiedStocks[item._id] !== undefined
        ? modifiedStocks[item._id]
        : Number(item.stock || 0);

    let matchStock = true;
    if (stockFilter === "Low Stock") {
      matchStock = currentStock > 0 && currentStock < 5;
    } else if (stockFilter === "Out of Stock") {
      matchStock = currentStock === 0;
    }

    return matchSearch && matchStock;
  });

  const modifiedCount = Object.keys(modifiedStocks).length;

  if (loading) {
    return (
      <p className="p-6 text-gray-500 text-center">Loading stock data...</p>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Stock Management ⚡</h1>
          <p className="text-gray-500 mt-1">
            Manage and update warehouse stock levels quickly.
          </p>
        </div>

        {modifiedCount > 0 && (
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition ml-auto md:ml-0"
          >
            <Save size={18} />
            {saving ? "Saving..." : `Save Changes (${modifiedCount})`}
          </button>
        )}
      </div>

      {statusMessage && (
        <div className="bg-slate-900 text-white px-4 py-3 rounded-xl mb-6 flex items-center justify-between shadow text-sm">
          <span>{statusMessage}</span>
          <button
            onClick={() => setStatusMessage("")}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            placeholder="Search products, brands..."
            className="w-full border p-3 pl-10 rounded-xl outline-none focus:border-orange-500 transition text-sm bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            size={18}
            className="absolute left-3.5 top-3.5 text-gray-400"
          />
        </div>

        <div className="flex gap-2">
          {["All", "Low Stock", "Out of Stock"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStockFilter(filter)}
              className={`px-4 py-2.5 rounded-xl border text-sm transition font-medium ${
                stockFilter === filter
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Product
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Category
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Brand
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Current Stock
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredProducts.map((item) => {
              const currentStock =
                modifiedStocks[item._id] !== undefined
                  ? modifiedStocks[item._id]
                  : Number(item.stock || 0);

              const isModified = modifiedStocks[item._id] !== undefined;

              let statusBadge = (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Good Stock
                </span>
              );

              if (currentStock === 0) {
                statusBadge = (
                  <span className="flex items-center gap-1 bg-red-100 text-red-700 w-fit px-3 py-1 rounded-full text-xs font-semibold">
                    <AlertOctagon size={12} />
                    Out of Stock
                  </span>
                );
              } else if (currentStock < 5) {
                statusBadge = (
                  <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 w-fit px-3 py-1 rounded-full text-xs font-semibold">
                    <AlertTriangle size={12} />
                    Low Stock
                  </span>
                );
              }

              return (
                <tr
                  key={item._id}
                  className={isModified ? "bg-orange-50/20" : ""}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded-lg"
                        unoptimized
                      />
                      <div>
                        <p className="font-bold text-gray-800 text-sm line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          SKU: {item.sku || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {item.category || "N/A"}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {item.brand || "N/A"}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        className={`w-20 border p-2 rounded-lg text-center font-semibold text-sm outline-none focus:border-orange-500 transition ${
                          isModified
                            ? "border-orange-400 bg-orange-50/50"
                            : "bg-gray-50 border-gray-200"
                        }`}
                        value={currentStock}
                        onChange={(e) =>
                          handleStockChange(item._id, e.target.value)
                        }
                      />
                      {isModified && (
                        <span
                          className="text-orange-500"
                          title="Unsaved changes"
                        >
                          ●
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4">{statusBadge}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <p className="p-8 text-center text-gray-500 text-sm">
            No products found matching filters.
          </p>
        )}
      </div>
    </div>
  );
}
