"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="p-10 text-center text-lg">
        Loading profile...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4">Please login first.</p>

        <Link
          href="/login"
          className="bg-black text-white px-5 py-3 rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const role = session.user.role;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Top Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-4xl font-bold shadow-lg">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                {session.user.name}
              </h1>

              <p className="text-gray-500 mt-1">
                {session.user.email}
              </p>

              <span
                className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-medium ${
                  role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {role}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/products"
              className="bg-black text-white px-5 py-3 rounded-xl"
            >
              Browse Products
            </Link>

            {role === "admin" && (
              <Link
                href="/admin/dashboard"
                className="bg-purple-600 text-white px-5 py-3 rounded-xl"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Account Type</p>

            <h2 className="text-2xl font-bold mt-2 capitalize">
              {role}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Status</p>

            <h2 className="text-2xl font-bold mt-2 text-green-600">
              Active
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Member Since</p>

            <h2 className="text-2xl font-bold mt-2">
              2026
            </h2>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">
            Quick Actions ⚡
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/products"
              className="border rounded-2xl p-5 hover:shadow-md transition"
            >
              <h3 className="font-bold text-lg">Products</h3>
              <p className="text-gray-500 mt-2">
                Browse all electric products
              </p>
            </Link>

            <Link
              href="/admin/reservations"
              className="border rounded-2xl p-5 hover:shadow-md transition"
            >
              <h3 className="font-bold text-lg">Reservations</h3>
              <p className="text-gray-500 mt-2">
                Check reservation requests
              </p>
            </Link>

            {role === "admin" && (
              <Link
                href="/admin/products"
                className="border rounded-2xl p-5 hover:shadow-md transition"
              >
                <h3 className="font-bold text-lg">
                  Manage Products
                </h3>

                <p className="text-gray-500 mt-2">
                  Add, edit and delete products
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}