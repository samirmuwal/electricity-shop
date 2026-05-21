"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignup = async () => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Signup successful!");
      router.push("/login");
    } else {
      alert("User already exists");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 flex flex-col gap-4">
      <input placeholder="Name" onChange={(e) =>
        setForm({ ...form, name: e.target.value })
      } />

      <input placeholder="Email" onChange={(e) =>
        setForm({ ...form, email: e.target.value })
      } />

      <input type="password" placeholder="Password" onChange={(e) =>
        setForm({ ...form, password: e.target.value })
      } />

      <button onClick={handleSignup} className="bg-black text-white p-2">
        Signup
      </button>
    </div>
  );
}