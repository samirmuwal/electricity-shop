"use client";

import { useCart } from "@/context/CartContext";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
export default function CartPage() {
  const { cart, increase, decrease, removeFromCart, setCart } = useCart();

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      // Set cart to empty list (manually or via a clear method)
      // Since CartContext doesn't have clearCart, we can do it by removing all or using the state hook
      // CartContext has: cart, addToCart, removeFromCart, increase, decrease.
      // So we can remove all items one by one, or just call removeFromCart in a loop,
      // or we can see if we can edit CartContext to include clearCart.
      // But we can easily just remove items. Let's do it using removeFromCart in a loop or add a clear function.
      cart.forEach((item) => removeFromCart(item._id));
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.salePrice > 0 ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Looks like you haven't added any electrical products to your cart yet.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Browse Products
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart 🛒</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b pb-4 mb-2">
            <span className="text-gray-500 font-medium">{totalItems} items in your cart</span>
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-600 font-semibold text-sm transition"
            >
              Clear Cart
            </button>
          </div>

          <div className="space-y-4">
            {cart.map((item) => {
              const currentPrice = item.salePrice > 0 ? item.salePrice : item.price;
              return (
                <div
                  key={item._id}
                  className="bg-white border rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm"
                >
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-lg"
                    unoptimized
                  />

                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-xs bg-orange-50 text-orange-600 px-2.5 py-0.5 rounded-full font-medium inline-block mb-1">
                      {item.category || "Electrical"}
                    </span>
                    <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">Brand: {item.brand || "N/A"}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decrease(item._id)}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => increase(item._id)}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-center sm:text-right min-w-[80px]">
                    <p className="font-bold text-gray-800">₹{currentPrice * item.quantity}</p>
                    <p className="text-xs text-gray-400 mt-0.5">₹{currentPrice} each</p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Items Total</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Shipping Charge</span>
              <span className="text-green-600 font-semibold">Free Delivery</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-800">
              <span>Total Pay</span>
              <span>₹{subtotal}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition"
          >
            Checkout Order
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
