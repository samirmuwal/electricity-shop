export const dynamic = "force-dynamic";

import Link from "next/link";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Reservation from "@/models/Reservation";

export default async function DashboardPage() {
  await connectDB();

  const products = await Product.find();
  const reservations = await Reservation.find().sort({ createdAt: -1 }).limit(5);

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, item) => sum + Number(item.stock || 0),
    0
  );

  const lowStock = products.filter(
    (item) => Number(item.stock) > 0 && Number(item.stock) < 5
  );

  const outOfStock = products.filter(
    (item) => Number(item.stock) === 0
  );

  const totalReservations = reservations.length;

  const pendingReservations = reservations.filter(
    (item) => item.status === "pending"
  ).length;

  const confirmedReservations = reservations.filter(
    (item) => item.status === "confirmed"
  ).length;

  const completedReservations = reservations.filter(
    (item) => item.status === "completed"
  ).length;

  const cards = [
    {
      title: "Total Products",
      value: totalProducts,
      color: "bg-blue-500",
      icon: "📦",
    },
    {
      title: "Total Stock",
      value: totalStock,
      color: "bg-green-500",
      icon: "⚡",
    },
    {
      title: "Low Stock",
      value: lowStock.length,
      color: "bg-yellow-500",
      icon: "⚠️",
    },
    {
      title: "Out Of Stock",
      value: outOfStock.length,
      color: "bg-red-500",
      icon: "❌",
    },
    {
      title: "Reservations",
      value: totalReservations,
      color: "bg-purple-500",
      icon: "📋",
    },
    {
      title: "Pending",
      value: pendingReservations,
      color: "bg-orange-500",
      icon: "🕒",
    },
    {
      title: "Confirmed",
      value: confirmedReservations,
      color: "bg-emerald-500",
      icon: "✅",
    },
    {
      title: "Completed",
      value: completedReservations,
      color: "bg-indigo-500",
      icon: "🎉",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard 📊</h1>
          <p className="text-gray-500 mt-1">
            Manage your electrical shop easily.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/add-product"
            className="bg-black text-white px-5 py-3 rounded-xl"
          >
            Add Product
          </Link>

          <Link
            href="/admin/products"
            className="border px-5 py-3 rounded-xl"
          >
            Manage Products
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.color} text-white rounded-2xl p-6 shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-90">{card.title}</p>
              <span className="text-2xl">{card.icon}</span>
            </div>

            <h2 className="text-3xl font-bold mt-4">{card.value}</h2>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        {/* Low stock */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Low Stock Products ⚠️
          </h2>

          {lowStock.length === 0 ? (
            <p className="text-gray-500">No low stock products.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border rounded-xl p-3"
                >
                  <p className="font-medium">{item.name}</p>

                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Out of stock */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Out Of Stock ❌
          </h2>

          {outOfStock.length === 0 ? (
            <p className="text-gray-500">No out of stock products.</p>
          ) : (
            <div className="space-y-3">
              {outOfStock.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border rounded-xl p-3"
                >
                  <p className="font-medium">{item.name}</p>

                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                    Out
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-5">
          Recent Reservations 📋
        </h2>

        {reservations.length === 0 ? (
          <p className="text-gray-500">No reservations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Quantity</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.phone}</td>

                    <td className="p-3">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}