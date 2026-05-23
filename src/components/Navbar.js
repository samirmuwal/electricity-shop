"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const [setting, setSetting] = useState({
    shopName: "Electric Shop",
    logo: "",
    phone: "",
    whatsapp: "",
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/shop-settings");
        const data = await res.json();

        if (data.setting) {
          setSetting({
            shopName: data.setting.shopName || "Electric Shop",
            logo: data.setting.logo || "",
            phone: data.setting.phone || "",
            whatsapp: data.setting.whatsapp || "",
          });
        }
      } catch (error) {
        console.log("Navbar settings error:", error);
      }
    }

    fetchSettings();
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-3">
        {setting.logo ? (
          <img
            src={setting.logo}
            alt={setting.shopName}
            className="w-10 h-10 rounded-full object-cover border"
          />
        ) : (
          <span className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
            ⚡
          </span>
        )}

        <span className="text-xl font-bold">{setting.shopName}</span>
      </Link>

      <div className="flex items-center gap-4">
        {role === "admin" ? (
          <Link href="/products">Shop</Link>
        ) : (
          <Link href="/products">Products</Link>
        )}

        {setting.whatsapp && (
          <a
            href={`https://wa.me/${setting.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            WhatsApp
          </a>
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

              <div className="leading-tight hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">
                  {session.user.name}
                </p>

                <p className="text-xs text-gray-500">{session.user.role}</p>
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