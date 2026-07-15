"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { ShoppingBag, ArrowLeft, CheckCircle, CreditCard, Gift } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function CheckoutPage() {
  const { cart, removeFromCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "COD",
  });

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [error, setError] = useState("");

  const subtotal = cart.reduce((sum, item) => {
    const price = item.salePrice > 0 ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          items: cart,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessOrder(data.order);
        // Clear cart
        cart.forEach((item) => removeFromCart(item._id));
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to place order. Connection error.");
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed! 🎉</h1>
        <p className="text-gray-500 mb-4">
          Thank you for shopping with us. Your order has been successfully placed.
        </p>

        <div className="bg-gray-50 border rounded-2xl p-6 text-left mb-8 space-y-3">
          <p className="text-sm text-gray-600">
            <strong className="text-gray-800">Order ID:</strong> {successOrder._id}
          </p>
          <p className="text-sm text-gray-600">
            <strong className="text-gray-800">Total Amount:</strong> ₹{successOrder.totalAmount}
          </p>
          <p className="text-sm text-gray-600">
            <strong className="text-gray-800">Payment Status:</strong>{" "}
            <span className="capitalize px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
              {successOrder.paymentStatus}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            <strong className="text-gray-800">Shipping Address:</strong> {successOrder.address},{" "}
            {successOrder.city}, {successOrder.state} - {successOrder.pincode}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="border hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-semibold transition"
          >
            View Your Orders
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No items for checkout</h1>
        <Link href="/products" className="bg-orange-500 text-white px-5 py-2.5 rounded-xl">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition"
      >
        <ArrowLeft size={16} />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold mb-8">Checkout Checkout ⚡</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Billing details form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">Delivery Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">Full Name *</label>
                <input
                  required
                  placeholder="Enter full name"
                  className="w-full border p-3 rounded-xl outline-none focus:border-orange-500 transition text-sm bg-gray-50"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">Phone Number *</label>
                <input
                  required
                  type="tel"
                  placeholder="Enter 10-digit number"
                  className="w-full border p-3 rounded-xl outline-none focus:border-orange-500 transition text-sm bg-gray-50"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full border p-3 rounded-xl outline-none focus:border-orange-500 transition text-sm bg-gray-50"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">Address *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="House/Office No, Street, Landmark"
                  className="w-full border p-3 rounded-xl outline-none focus:border-orange-500 transition text-sm bg-gray-50"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">City *</label>
                <input
                  required
                  placeholder="Enter city"
                  className="w-full border p-3 rounded-xl outline-none focus:border-orange-500 transition text-sm bg-gray-50"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">State *</label>
                <input
                  required
                  placeholder="Enter state"
                  className="w-full border p-3 rounded-xl outline-none focus:border-orange-500 transition text-sm bg-gray-50"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">Pincode *</label>
                <input
                  required
                  placeholder="Enter pincode"
                  className="w-full border p-3 rounded-xl outline-none focus:border-orange-500 transition text-sm bg-gray-50"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Payment selector */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">Payment Method</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <label
                className={`border rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition ${
                  form.paymentMethod === "COD"
                    ? "border-orange-500 bg-orange-50/50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={form.paymentMethod === "COD"}
                  onChange={() => setForm({ ...form, paymentMethod: "COD" })}
                  className="accent-orange-500 w-4 h-4"
                />
                <div>
                  <p className="font-bold text-gray-800 text-sm">Cash on Delivery (COD)</p>
                  <p className="text-xs text-gray-500">Pay when order is delivered</p>
                </div>
              </label>

              <label
                className={`border rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition ${
                  form.paymentMethod === "Razorpay"
                    ? "border-orange-500 bg-orange-50/50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={form.paymentMethod === "Razorpay"}
                  onChange={() => setForm({ ...form, paymentMethod: "Razorpay" })}
                  className="accent-orange-500 w-4 h-4"
                />
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-gray-600" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Online Payment</p>
                    <p className="text-xs text-gray-500 font-semibold text-green-600">Simulated Test Mode</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition text-base"
          >
            {loading ? "Placing Order..." : "Confirm & Place Order"}
          </button>
        </form>

        {/* Order review */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Review Order</h2>

          <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2">
            {cart.map((item) => {
              const price = item.salePrice > 0 ? item.salePrice : item.price;
              return (
                <div key={item._id} className="flex gap-3 items-center border-b pb-3 last:border-0 last:pb-0">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg"
                    unoptimized
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-800 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      ₹{price} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-sm text-gray-800 flex-shrink-0">
                    ₹{price * item.quantity}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="space-y-3 pt-4 border-t text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t">
              <span>Total Bill</span>
              <span>₹{subtotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
