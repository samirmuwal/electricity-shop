"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, ShieldAlert, Check, X } from "lucide-react";
import Link from "next/link";

export default function CustomerOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/orders");
    }
  }, [status, router]);

  async function loadOrders() {
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
    if (status === "authenticated") {
      loadOrders();
    }
  }, [status]);

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setCancellingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, status: "cancelled" } : ord))
        );
      } else {
        alert(data.error || "Failed to cancel order");
      }
    } catch (err) {
      console.error(err);
      alert("Network error cancelling order");
    } finally {
      setCancellingId(null);
    }
  };

  const steps = ["pending", "confirmed", "packed", "shipped", "delivered"];

  const getStepIndex = (status) => {
    return steps.indexOf(status);
  };

  if (status === "loading" || loading) {
    return <p className="p-8 text-center text-gray-500">Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShoppingBag size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">No Orders Placed</h1>
        <p className="text-gray-500 mb-6">You haven't placed any orders with us yet.</p>
        <Link href="/products" className="bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-xl font-semibold transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 w-full">
      <h1 className="text-3xl font-bold mb-8">My Orders 📦</h1>

      <div className="space-y-8">
        {orders.map((order) => {
          const currentStep = getStepIndex(order.status);
          const isCancelled = order.status === "cancelled";

          return (
            <div key={order._id} className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 gap-2">
                <div>
                  <p className="text-xs text-gray-400 font-mono">Order ID: {order._id}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Placed: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-800">Total: ₹{order.totalAmount}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold uppercase">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-gray-700">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Timeline tracking */}
              {!isCancelled ? (
                <div className="border-t pt-6">
                  <p className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4">
                    Tracking Timeline
                  </p>
                  <div className="grid grid-cols-5 text-center text-[10px] sm:text-xs font-semibold relative">
                    <div className="absolute top-2 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-10" />
                    <div
                      className="absolute top-2 left-[10%] h-0.5 bg-orange-500 -z-10 transition-all duration-500"
                      style={{
                        width: `${currentStep >= 0 ? (currentStep / 4) * 80 : 0}%`,
                      }}
                    />

                    {steps.map((step, idx) => {
                      const isActive = currentStep >= idx;
                      return (
                        <div key={step} className="flex flex-col items-center">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] border transition ${
                              isActive
                                ? "bg-orange-500 border-orange-500 text-white"
                                : "bg-white border-gray-300 text-gray-400"
                            }`}
                          >
                            {isActive ? "✓" : idx + 1}
                          </span>
                          <span className={`capitalize mt-2 ${isActive ? "text-orange-600" : "text-gray-400"}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="border-t pt-4 flex items-center gap-2 text-red-600 font-semibold text-sm">
                  <ShieldAlert size={16} />
                  This order was cancelled.
                </div>
              )}

              {/* Action Buttons */}
              {order.status === "pending" && (
                <div className="border-t pt-4 flex justify-end">
                  <button
                    disabled={cancellingId === order._id}
                    onClick={() => handleCancelOrder(order._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-xl text-xs transition"
                  >
                    {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
