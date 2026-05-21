"use client";

import { useState } from "react";

export default function ReserveButton({ productId }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleReserve = async () => {
    if (!name || !phone) {
      alert("Name aur phone required hai");
      return;
    }

    setLoading(true);

    await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        productId,
        quantity,
      }),
    });

    setLoading(false);
    alert("Reservation created!");

    setName("");
    setPhone("");
    setQuantity(1);
  };

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-xl">
      <h3 className="font-bold mb-3">Reserve Product</h3>

      <input
        placeholder="Your name"
        className="border p-2 rounded w-full mb-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Phone number"
        className="border p-2 rounded w-full mb-3"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        type="number"
        min="1"
        className="border p-2 rounded w-full mb-3"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <button
        onClick={handleReserve}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Reserving..." : "Reserve Now"}
      </button>
    </div>
  );
}