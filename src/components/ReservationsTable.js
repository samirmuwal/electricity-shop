"use client";

import { useEffect, useState } from "react";
import ReservationActions from "@/components/ReservationActions";
import PrintReceiptButton from "@/components/PrintReceiptButton";

function statusClass(status) {
  if (status === "confirmed") return "bg-green-100 text-green-700";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  if (status === "completed") return "bg-blue-100 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
}

export default function ReservationsTable() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    async function fetchReservations() {
      try {
        const res = await fetch("/api/reservations", {
          cache: "no-store",
        });

        const data = await res.json();
        setReservations(data.reservations || []);
      } catch (error) {
        console.log("Fetch reservations error:", error);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, []);

  const filtered = reservations.filter((item) => {
    const text = `${item.name || ""} ${item.phone || ""} ${
      item.product?.name || item.productName || ""
    }`.toLowerCase();

    const matchSearch = text.includes(search.toLowerCase());
    const matchStatus = status === "All" || item.status === status;

    return matchSearch && matchStatus;
  });

  if (loading) {
    return <p className="p-6 text-gray-500">Loading reservations...</p>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          placeholder="Search name, phone, product..."
          className="border p-3 rounded-lg flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-3 rounded-lg"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
              <th className="p-3 text-left">Print</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="p-3">{item.name || "N/A"}</td>
                <td className="p-3">{item.phone || "N/A"}</td>
                <td className="p-3">
                  {item.product?.name || item.productName || "Product deleted"}
                </td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${statusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3">
                  <ReservationActions id={item._id} />
                </td>
                <td className="p-3">
                  <PrintReceiptButton reservation={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="p-6 text-gray-500">No reservations found.</p>
        )}
      </div>
    </div>
  );
}