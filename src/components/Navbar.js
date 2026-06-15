"use client";
import { Search, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target)
    ) {
      setSearchOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);
 return (
  <>
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

        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <div className="relative">
  <Search size={20} />

  {products.length > 0 && (
    <span className="absolute -top-2 -right-2 text-[10px] bg-black text-white px-1.5 rounded-full">
      {products.length}
    </span>
  )}
</div>
        </button>

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

    {searchOpen && (
      
      <div  ref={searchRef} className="absolute top-[70px] right-6 w-[350px] md:w-[450px] bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden">
        <div className="max-h-72 overflow-y-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-4 outline-none border-b"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <div className="mt-3 max-h-80 overflow-y-auto">
              {filteredProducts.slice(0, 10).map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  onClick={() => {
                    setSearch("");
                    setSearchOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
                >
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="w-12 h-12 object-contain"
                  />

                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{product.price}
                    </p>
                  </div>
                </Link>
              ))}

              {filteredProducts.length === 0 && (
                <p className="p-3 text-gray-500">
                  No products found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    )}
  </>
)
};