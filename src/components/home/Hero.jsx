"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, BadgePercent } from "lucide-react";

export default function Hero({ shopName, whatsapp }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-orange-600 text-white">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>

            <span className="inline-block bg-orange-500 px-4 py-2 rounded-full text-sm font-semibold">
              ⚡ Trusted Electrical Store
            </span>

            <h1 className="text-5xl lg:text-6xl font-extrabold mt-6 leading-tight">
              Premium Electrical Products
              <span className="text-orange-400">
                {" "}At Best Prices
              </span>
            </h1>

            <p className="text-gray-300 mt-6 text-lg leading-8">
              Buy premium quality switches, wires, fans,
              MCB, lights, sockets and electrical accessories
              from {shopName}.
            </p>

            <div className="flex gap-4 mt-8 flex-wrap">

              <Link
                href="/products"
                className="bg-orange-500 hover:bg-orange-600 transition px-8 py-4 rounded-xl font-semibold flex items-center gap-2"
              >
                Shop Now
                <ArrowRight size={18}/>
              </Link>

              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  className="border border-white px-8 py-4 rounded-xl hover:bg-white hover:text-black transition"
                >
                  WhatsApp
                </a>
              )}

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div className="grid grid-cols-2 gap-5">

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">

                <div className="text-5xl">💡</div>

                <h3 className="mt-4 text-xl font-bold">
                  LED Lights
                </h3>

                <p className="text-gray-300 mt-2">
                  Energy efficient lighting solutions.
                </p>

              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">

                <div className="text-5xl">⚡</div>

                <h3 className="mt-4 text-xl font-bold">
                  Switches
                </h3>

                <p className="text-gray-300 mt-2">
                  Modular switches from top brands.
                </p>

              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">

                <div className="text-5xl">🔌</div>

                <h3 className="mt-4 text-xl font-bold">
                  Wiring
                </h3>

                <p className="text-gray-300 mt-2">
                  Safe & durable electrical wires.
                </p>

              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">

                <div className="text-5xl">🛠</div>

                <h3 className="mt-4 text-xl font-bold">
                  Tools
                </h3>

                <p className="text-gray-300 mt-2">
                  Professional electrical tools.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom Features */}

        <div className="grid md:grid-cols-3 gap-6 mt-16">

          <div className="bg-white text-black rounded-xl p-5 flex items-center gap-4">

            <Truck className="text-orange-500"/>

            <div>
              <h4 className="font-bold">
                Fast Delivery
              </h4>
              <p className="text-sm text-gray-600">
                Quick delivery across India.
              </p>
            </div>

          </div>

          <div className="bg-white text-black rounded-xl p-5 flex items-center gap-4">

            <ShieldCheck className="text-green-600"/>

            <div>
              <h4 className="font-bold">
                Genuine Products
              </h4>
              <p className="text-sm text-gray-600">
                100% branded electrical items.
              </p>
            </div>

          </div>

          <div className="bg-white text-black rounded-xl p-5 flex items-center gap-4">

            <BadgePercent className="text-red-500"/>

            <div>
              <h4 className="font-bold">
                Best Offers
              </h4>
              <p className="text-sm text-gray-600">
                Exciting discounts every week.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}