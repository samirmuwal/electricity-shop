"use client";
import { Search, Menu, X, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const { cart } = useCart();

  const [setting, setSetting] = useState({
    shopName: "Electric Shop",
    logo: "",
    phone: "",
    whatsapp: "",
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const searchRef = useRef(null);

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

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const cartItemCount = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <>
      {/* Top Header / Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span>📞 {setting.phone || "+91 9876543210"}</span>
            <span className="hidden md:block">⚡ Genuine Electrical Products</span>
          </div>

          <div className="flex gap-6 items-center">
            <Link href="/products" className="hover:underline">Shop</Link>
            {role === "admin" && (
              <Link href="/admin/dashboard" className="text-yellow-400 font-semibold hover:underline">
                Admin Panel 🛠️
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center">
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
          <Link
            href="/products"
            className="text-gray-700 hover:text-black font-medium transition"
          >
            Products
          </Link>

          {/* Search Button Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition relative"
          >
            <Search size={20} />
          </button>

          {/* Shopping Cart Button */}
          <Link
            href="/cart"
            className="p-2 rounded-full hover:bg-gray-100 transition relative"
          >
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>

          {setting.whatsapp && (
            <a
              href={`https://wa.me/${setting.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium items-center gap-2 transition"
            >
              WhatsApp
            </a>
          )}

          {/* User Auth Section */}
          {session ? (
            <div className="flex items-center gap-3">
              <Link
  href="/profile"
  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-2 lg:px-3 py-2 rounded-full transition"
>
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
                <div className="leading-tight hidden lg:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {session.user.name}
                  </p>
                  <p className="text-[10px] text-gray-500 capitalize">
                    {session.user.role}
                  </p>
                </div>
              </Link>

              <button
  onClick={() => signOut({ callbackUrl: "/login" })}
  className="hidden lg:flex bg-red-600 text-white px-4 py-2 rounded-lg items-center justify-center"
>
  Logout
</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-700 hover:text-black font-medium text-sm transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-black hover:bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Dropdown Search Panel */}
      {searchOpen && (
        <div
          ref={searchRef}
          className="absolute top-[70px] right-6 w-[350px] md:w-[450px] bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden"
        >
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-2 outline-none bg-gray-50 rounded-lg border text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          <div className="max-h-72 overflow-y-auto">
            {search && (
              <div className="p-2">
                {filteredProducts.slice(0, 10).map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    onClick={() => {
                      setSearch("");
                      setSearchOpen(false);
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
                  >
                    <img
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      className="w-10 h-10 object-contain rounded border bg-white"
                    />
                    <div className="text-left">
                      <p className="font-medium text-sm text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-xs text-orange-600 font-semibold">
                        ₹{product.price}
                      </p>
                    </div>
                  </Link>
                ))}

                {filteredProducts.length === 0 && (
                  <p className="p-4 text-center text-sm text-gray-500">
                    No products found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}