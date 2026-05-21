"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }) {
  const router = useRouter();

  const handleDelete = async () => {
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 font-semibold"
    >
      Delete
    </button>
  );
}