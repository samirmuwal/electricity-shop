"use client";

import { useEffect, useState } from "react";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState("");

  async function loadBrands() {
    const res = await fetch("/api/brands");
    const data = await res.json();
    setBrands(data.brands || []);
  }

  useEffect(() => {
    loadBrands();
  }, []);

  async function addBrand(e) {
    e.preventDefault();

    if (!name.trim()) return;

    await fetch("/api/brands", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    setName("");
    loadBrands();
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Brands</h1>

      <form onSubmit={addBrand} className="flex gap-4 mb-10">
        <input
          className="border rounded-lg px-4 py-3 flex-1"
          placeholder="Brand Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="bg-black text-white px-6 rounded-lg">
          Add
        </button>
      </form>

      <div className="bg-white rounded-xl shadow">
        {brands.map((item) => (
          <div
            key={item._id}
            className="border-b p-4 flex justify-between"
          >
            <span>{item.name}</span>
            <span className="text-gray-500">{item.slug}</span>
          </div>
        ))}
      </div>
    </div>
  );
}