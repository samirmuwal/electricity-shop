"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    await signIn("credentials", {
      username: form.email,   // 🔥 IMPORTANT
      password: form.password,
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="max-w-sm mx-auto p-6 flex flex-col gap-4">
      <input
        placeholder="Email"
        className="border p-2"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button
        onClick={handleLogin}
        className="bg-black text-white p-2"
      >
        Login
      </button>
    </div>
  );
}