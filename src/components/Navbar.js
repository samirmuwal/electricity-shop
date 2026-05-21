"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        ⚡ Electric Shop
      </Link>

      <div className="flex items-center gap-4">

        {role === "admin" ? (
          <Link href="/products">Shop</Link>
        ) : (
          <Link href="/products">Products</Link>
        )}

       

        {session ? (
          <>
            <Link
              href="/profile"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition"
            >
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
                {session.user.name?.charAt(0).toUpperCase()}
              </span>

              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-800">
                  {session.user.name}
                </p>

                <p className="text-xs text-gray-500">
                  {session.user.role}
                </p>
              </div>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link
              href="/signup"
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
}