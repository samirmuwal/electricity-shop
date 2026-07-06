"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Facebook, Twitter, Instagram, Send, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const [setting, setSetting] = useState({
    shopName: "Electric Shop",
    phone: "",
    address: "",
    email: "contact@electrickshop.com",
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/shop-settings");
        const data = await res.json();
        if (data.setting) {
          setSetting({
            shopName: data.setting.shopName || "Electric Shop",
            phone: data.setting.phone || "",
            address: data.setting.address || "",
            email: data.setting.email || "contact@electrickshop.com",
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <footer className="bg-slate-950 text-gray-400 text-sm mt-auto border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Description */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-xl">
            <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-base">
              ⚡
            </span>
            {setting.shopName}
          </Link>
          <p className="text-gray-500 leading-6 text-xs">
            Your single-destination online warehouse for electrical appliances, switches, modular wire systems, and power utility tools.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-slate-900 hover:bg-orange-500 hover:text-white rounded-lg transition">
              <Facebook size={16} />
            </a>
            <a href="#" className="p-2 bg-slate-900 hover:bg-orange-500 hover:text-white rounded-lg transition">
              <Twitter size={16} />
            </a>
            <a href="#" className="p-2 bg-slate-900 hover:bg-orange-500 hover:text-white rounded-lg transition">
              <Instagram size={16} />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/products" className="hover:text-white transition">
                Browse Shop
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-white transition">
                Track Orders
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white transition">
                View Shopping Cart
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-white transition">
                My Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Store Contacts */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">Contact Info</h4>
          <ul className="space-y-3.5 text-xs">
            <li className="flex gap-2.5 items-start">
              <MapPin size={16} className="text-orange-500 flex-shrink-0" />
              <span>{setting.address || "123 Main Street, Industrial Area, Phase-I, India"}</span>
            </li>
            <li className="flex gap-2.5 items-center">
              <Phone size={16} className="text-orange-500 flex-shrink-0" />
              <span>{setting.phone || "+91 9876543210"}</span>
            </li>
            <li className="flex gap-2.5 items-center">
              <Mail size={16} className="text-orange-500 flex-shrink-0" />
              <span>{setting.email}</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="space-y-4">
          <h4 className="text-white font-bold uppercase tracking-wider text-xs">Newsletter</h4>
          <p className="text-gray-500 leading-6 text-xs">
            Subscribe to get latest update alerts, offers, and seasonal deals.
          </p>
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 overflow-hidden">
            <input
              placeholder="Your email address"
              className="bg-transparent border-0 outline-none text-xs px-3 py-2 flex-1 text-white placeholder-gray-600"
            />
            <button className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition flex items-center justify-center">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} {setting.shopName}. All Rights Reserved.</p>
          <p>Genuine & Certified Electrical Store</p>
        </div>
      </div>
    </footer>
  );
}
