"use client";

import Link from "next/link";
import { X, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function MobileDrawer({
  open,
  onClose,
  session,
}) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold">Menu</h2>

          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* User */}
        {session && (
          <div className="p-5 border-b">
            <p className="font-semibold">{session.user.name}</p>
            <p className="text-sm text-gray-500">
              {session.user.email}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col p-3">

          <Link
            href="/"
            onClick={onClose}
            className="px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            🏠 Home
          </Link>

          <Link
            href="/products"
            onClick={onClose}
            className="px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            📦 Products
          </Link>

          <Link
            href="/categories"
            onClick={onClose}
            className="px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            📂 Categories
          </Link>

          {session && (
            <Link
              href="/profile"
              onClick={onClose}
              className="px-4 py-3 rounded-lg hover:bg-gray-100"
            >
              👤 My Profile
            </Link>
          )}

          {session?.user?.role === "admin" && (
            <Link
              href="/admin/dashboard"
              onClick={onClose}
              className="px-4 py-3 rounded-lg hover:bg-gray-100"
            >
              ⚙ Dashboard
            </Link>
          )}

        </nav>

        {/* Bottom Logout */}
        {session && (
          <div className="absolute bottom-5 left-0 w-full px-4">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}