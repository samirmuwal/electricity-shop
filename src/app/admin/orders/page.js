"use client";

import { useEffect, useState } from "react";
import { Search, Printer, Eye, X, RefreshCw } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, updates) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, ...updates } : ord))
        );
        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, ...updates }));
        }
      } else {
        alert(data.error || "Failed to update order");
      }
    } catch (err) {
      console.error(err);
      alert("Network error updating order");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const text = `${ord.name || ""} ${ord.phone || ""} ${ord._id || ""}`.toLowerCase();
    const matchSearch = text.includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || ord.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "packed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "shipped":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const printInvoice = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order._id}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #333; }
            h1 { margin: 0 0 10px 0; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
            .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .details div { flex: 1; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
            th { background: #f9f9f9; }
            .total { text-align: right; font-size: 1.2em; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>ELECTRICK SHOP</h1>
              <p>Genuine Electrical Products</p>
            </div>
            <div>
              <h2>INVOICE</h2>
              <p>Order ID: ${order._id}</p>
              <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div class="details">
            <div>
              <h3>Billed To:</h3>
              <p><strong>${order.name}</strong></p>
              <p>${order.address}</p>
              <p>${order.city}, ${order.state} - ${order.pincode}</p>
              <p>Phone: ${order.phone}</p>
              <p>Email: ${order.email || "N/A"}</p>
            </div>
            <div>
              <h3>Payment & Order Status:</h3>
              <p>Payment Method: ${order.paymentMethod}</p>
              <p>Payment Status: ${order.paymentStatus}</p>
              <p>Order Status: ${order.status}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>₹${item.price}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price * item.quantity}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <p class="total">Total Pay: ₹${order.totalAmount}</p>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return <p className="p-6 text-gray-500 text-center">Loading orders data...</p>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders Management 📋</h1>
          <p className="text-gray-500 mt-1">Track customer orders, updates, and payments.</p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 border px-4 py-2 rounded-xl bg-white hover:bg-gray-50 text-sm font-semibold transition self-start"
        >
          <RefreshCw size={14} />
          Refresh List
        </button>
      </div>

      {/* Search and filter toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            placeholder="Search Order ID, Name, Phone..."
            className="w-full border p-3 pl-10 rounded-xl outline-none focus:border-orange-500 transition text-sm bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {["All", "pending", "confirmed", "packed", "shipped", "delivered", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold capitalize whitespace-nowrap transition ${
                statusFilter === status
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Order ID</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Customer</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Total Price</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Payment</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Change Status</th>
              <th className="p-4 text-center text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50/50">
                <td className="p-4">
                  <span className="font-mono text-xs font-semibold text-gray-800">
                    {order._id.substring(0, 10)}...
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </td>

                <td className="p-4">
                  <p className="font-bold text-gray-800 text-sm">{order.name}</p>
                  <p className="text-xs text-gray-500">{order.phone}</p>
                </td>

                <td className="p-4 font-bold text-sm text-gray-800">₹{order.totalAmount}</td>

                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      {order.paymentMethod}
                    </span>
                    <select
                      className="border rounded px-2 py-1 text-xs outline-none bg-white font-medium"
                      value={order.paymentStatus}
                      onChange={(e) =>
                        handleUpdateStatus(order._id, { paymentStatus: e.target.value })
                      }
                      disabled={updatingId === order._id}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </td>

                <td className="p-4">
                  <span
                    className={`inline-block border text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="p-4">
                  <select
                    className="border rounded-lg p-2 text-xs outline-none bg-white font-semibold"
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order._id, { status: e.target.value })}
                    disabled={updatingId === order._id}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => printInvoice(order)}
                      className="p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition"
                      title="Print Invoice"
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <p className="p-8 text-center text-gray-500 text-sm">No orders found.</p>
        )}
      </div>

      {/* Details drawer/modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                <p className="text-xs text-gray-500 mt-1 font-mono">ID: {selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-black border p-1.5 rounded-lg bg-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-800 uppercase tracking-wide text-xs">
                    Customer Info
                  </h3>
                  <p className="font-semibold">{selectedOrder.name}</p>
                  <p className="text-gray-600">Phone: {selectedOrder.phone}</p>
                  <p className="text-gray-600">Email: {selectedOrder.email || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-gray-800 uppercase tracking-wide text-xs">
                    Delivery Address
                  </h3>
                  <p className="text-gray-600">
                    {selectedOrder.address}
                    <br />
                    {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-bold text-gray-800 uppercase tracking-wide text-xs mb-3">
                  Ordered Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                      <div>
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          ₹{item.price} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-xs">Payment Method: {selectedOrder.paymentMethod}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Order Status: <span className="capitalize font-semibold">{selectedOrder.status}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Total Bill</p>
                  <p className="text-xl font-bold text-orange-600">₹{selectedOrder.totalAmount}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3 justify-end">
              <button
                onClick={() => printInvoice(selectedOrder)}
                className="bg-black hover:bg-neutral-800 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm transition"
              >
                <Printer size={14} />
                Print Invoice
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="border hover:bg-gray-100 font-semibold px-4 py-2.5 rounded-xl text-sm text-gray-700 transition bg-white"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
