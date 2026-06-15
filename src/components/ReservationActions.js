"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReservationActions({
  id,
  refreshReservations,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status) {
    setLoading(true);

    const res = await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    setLoading(false);

   if (data.success) {
  refreshReservations?.();
} else {
  alert(data.error || "Status update failed");
}
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={() => updateStatus("confirmed")}
        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
      >
        Confirm
      </button>

      <button
        disabled={loading}
        onClick={() => updateStatus("cancelled")}
        className="bg-red-600 text-white px-3 py-1 rounded text-sm"
      >
        Cancel
      </button>

      <button
        disabled={loading}
        onClick={() => updateStatus("completed")}
        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
      >
        Complete
      </button>
    </div>
  );
}