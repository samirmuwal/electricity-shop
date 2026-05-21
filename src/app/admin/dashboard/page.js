import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Reservation from "@/models/Reservation";

export default async function DashboardPage() {
  await connectDB();

  const products = await Product.find();
  const reservations = await Reservation.find();

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, item) => sum + Number(item.stock || 0),
    0
  );

  const lowStock = products.filter((item) => Number(item.stock) < 5);

  const totalReservations = reservations.length;
  const pendingReservations = reservations.filter(
    (item) => item.status === "pending"
  ).length;

  const confirmedReservations = reservations.filter(
    (item) => item.status === "confirmed"
  ).length;

  const cancelledReservations = reservations.filter(
    (item) => item.status === "cancelled"
  ).length;

  const completedReservations = reservations.filter(
    (item) => item.status === "completed"
  ).length;

  const cards = [
    {
      title: "Total Products",
      value: totalProducts,
      color: "bg-blue-500",
    },
    {
      title: "Total Stock",
      value: totalStock,
      color: "bg-green-500",
    },
    {
      title: "Low Stock",
      value: lowStock.length,
      color: "bg-red-500",
    },
    {
      title: "Total Reservations",
      value: totalReservations,
      color: "bg-purple-500",
    },
    {
      title: "Pending",
      value: pendingReservations,
      color: "bg-yellow-500",
    },
    {
      title: "Confirmed",
      value: confirmedReservations,
      color: "bg-emerald-500",
    },
    {
      title: "Cancelled",
      value: cancelledReservations,
      color: "bg-rose-500",
    },
    {
      title: "Completed",
      value: completedReservations,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard 📊</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.color} text-white rounded-2xl p-6 shadow`}
          >
            <p className="text-sm opacity-90">{card.title}</p>
            <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Low Stock Products ⚠️</h2>

        {lowStock.length === 0 ? (
          <p className="text-gray-500">No low stock products.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Stock</th>
              </tr>
            </thead>

            <tbody>
              {lowStock.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3 text-red-600 font-bold">{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}