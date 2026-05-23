"use client";

import { useEffect, useState } from "react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  async function fetchCategories() {
    const res = await fetch("/api/categories", {
      cache: "no-store",
    });
    const data = await res.json();
    setCategories(data.categories || []);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();

    if (!name.trim()) return;

    setLoading(true);

    await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    setName("");
    setLoading(false);
    fetchCategories();
  }

  async function handleDelete(id) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    fetchCategories();
  }

  function startEdit(cat) {
    setEditId(cat._id);
    setEditName(cat.name);
  }

  async function handleUpdate(id) {
    if (!editName.trim()) return;

    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: editName }),
    });

    setEditId(null);
    setEditName("");
    fetchCategories();
  }

  return (
    <div className="max-w-3xl bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

      <form onSubmit={handleAdd} className="flex gap-3 mb-6">
        <input
          placeholder="Enter category name"
          className="border p-3 rounded-lg flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      <div className="space-y-3">
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories found.</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between gap-3 border rounded-xl p-4"
            >
              {editId === cat._id ? (
                <input
                  className="border p-2 rounded-lg flex-1"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              ) : (
                <p className="font-medium">{cat.name}</p>
              )}

              <div className="flex gap-2">
                {editId === cat._id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(cat._id)}
                      className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(cat)}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}