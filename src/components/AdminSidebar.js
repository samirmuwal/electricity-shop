"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/add-product", label: "Add Product" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/reservations", label: "Reservations" },
    { href: "/admin/settings", label: "Shop Settings" },
    { href: "/profile", label: "Profile" },
    { href: "/products", label: "View Website" },
  ];

  return (
    <>
      {/* Mobile Top Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-20 left-4 z-50 bg-black text-white px-4 py-2 rounded-lg"
      >
        ☰ Menu
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 bg-black text-white p-6 h-screen overflow-y-auto transform transition-transform duration-300
${open ? "translate-x-0" : "-translate-x-full"}
md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Admin Panel</h2>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-2xl"
          >
            ×
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="p-3 rounded-lg hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}