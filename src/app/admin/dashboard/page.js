export const dynamic = "force-dynamic";

import Link from "next/link";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Reservation from "@/models/Reservation";
import Order from "@/models/Order";
import User from "@/models/User";
import StockChart from "@/components/StockChart";
import OrdersChart from "@/components/OrdersChart";

export default async function DashboardPage() {
  await connectDB();

  const products = await Product.find().lean();
  const reservations = await Reservation.find().sort({ createdAt: -1 }).limit(5).lean();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  const users = await User.find({ role: "user" }).lean();

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, item) => sum + Number(item.stock || 0), 0);
  const lowStock = products.filter((item) => Number(item.stock) > 0 && Number(item.stock) < 5);
  const outOfStock = products.filter((item) => Number(item.stock) === 0);

  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;
  const customersCount = users.length;

  const cards = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue}`,
      color: "bg-orange-500",
      icon: "💰",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      color: "bg-blue-500",
      icon: "📦",
    },
    {
      title: "Pending Orders",
      value: pendingOrdersCount,
      color: "bg-yellow-500",
      icon: "🕒",
    },
    {
      title: "Total Customers",
      value: customersCount,
      color: "bg-green-500",
      icon: "👥",
    },
  ];

  // Stock Chart Data (Top 8 items)
  const stockChartData = products
    .slice(0, 8)
    .map((p) => ({
      name: p.name.length > 12 ? p.name.substring(0, 10) + "..." : p.name,
      stock: p.stock,
    }));

  // Daily Revenue Trend Data for Last 7 Days
  const last7Days = [...Array(7)]
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    })
    .reverse();

  const revenueChartData = last7Days.map((dateStr) => {
    const dayOrders = orders.filter((o) => {
      const oDate = new Date(o.createdAt).toISOString().split("T")[0];
      return oDate === dateStr && o.status !== "cancelled";
    });
    const amount = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      date: new Date(dateStr).toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
      }),
      amount,
    };
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview 📊</h1>
          <p className="text-gray-500 mt-1">Manage sales, stock levels, and operations.</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/add-product"
            className="bg-black hover:bg-neutral-800 text-white px-5 py-3 rounded-xl font-semibold text-sm transition"
          >
            Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="border bg-white hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-xl font-semibold text-sm transition"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.color} text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-90 font-medium">{card.title}</p>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <h2 className="text-3xl font-bold mt-4">{card.value}</h2>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <OrdersChart data={revenueChartData} />
        <StockChart data={stockChartData} />
      </div>

      {/* Alerts & Low Stock Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            Low Stock Products ⚠️
          </h2>
          {lowStock.length === 0 ? (
            <p className="text-gray-500 text-sm">All products have sufficient stock levels.</p>
          ) : (
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
              {lowStock.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border rounded-xl p-3 text-sm"
                >
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <span className="bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full font-bold">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Out Of Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            Out of Stock ❌
          </h2>
          {outOfStock.length === 0 ? (
            <p className="text-gray-500 text-sm">No products are out of stock.</p>
          ) : (
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
              {outOfStock.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border rounded-xl p-3 text-sm"
                >
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold">
                    Out
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity: Orders and Reservations */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-5">Recent Activity</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">
              Recent Orders
            </h3>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-xs">No orders placed yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 4).map((ord) => (
                  <div key={ord._id} className="flex justify-between border-b pb-2 text-xs">
                    <div>
                      <p className="font-bold">{ord.name}</p>
                    <p className="text-gray-400 font-mono">
  {String(ord._id).substring(0, 8)}...
</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">₹{ord.totalAmount}</p>
                      <p className="capitalize text-gray-500">{ord.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Reservations */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">
              Recent Reservations
            </h3>
            {reservations.length === 0 ? (
              <p className="text-gray-500 text-xs">No product reservations found.</p>
            ) : (
              <div className="space-y-3">
                {reservations.slice(0, 4).map((res) => (
                  <div key={res._id} className="flex justify-between border-b pb-2 text-xs">
                    <div>
                      <p className="font-bold">{res.name}</p>
                      <p className="text-gray-400">{res.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">Qty: {res.quantity}</p>
                      <p className="capitalize text-gray-500">{res.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}