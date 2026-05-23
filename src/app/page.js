import Link from "next/link";
import { connectDB } from "@/lib/db";
import ShopSetting from "@/models/ShopSetting";

export const dynamic = "force-dynamic";

export default async function Home() {
  await connectDB();

  const setting = await ShopSetting.findOne().lean();

  const shopName = setting?.shopName || "Electric Shop";
  const logo = setting?.logo || "";
  const whatsapp = setting?.whatsapp || "";

  const categories = [
    "Bulbs",
    "Switches",
    "Sockets",
    "Wires",
    "Fans",
    "Lights",
    "Tools",
    "MCB",
  ];

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="w-full px-6 md:px-10 lg:px-14 py-16">
        <div className="bg-black text-white rounded-3xl p-8 md:p-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-yellow-400 font-semibold mb-3">
              Trusted Electrical Store
            </p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Quality Electrical Products for Your Home
            </h1>

            <p className="text-gray-300 mt-5 text-lg">
              Buy bulbs, wires, switches, sockets, fans, lights and electrical
              tools at the best price.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="bg-white text-black px-6 py-3 rounded-xl font-semibold text-center"
              >
                Shop Now
              </Link>

              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-center"
                >
                  WhatsApp Enquiry
                </a>
              )}
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-8 text-center">
            {logo ? (
              <img
                src={logo}
                alt={shopName}
                className="w-28 h-28 mx-auto rounded-full object-cover bg-white p-2"
              />
            ) : (
              <div className="text-8xl">⚡</div>
            )}

            <h2 className="text-2xl font-bold mt-4">{shopName}</h2>

            <p className="text-gray-300 mt-2">
              Reliable products. Fast service.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full px-6 md:px-10 lg:px-14 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>

          <Link href="/products" className="text-blue-600 font-medium">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              href="/products"
              key={cat}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition text-center"
            >
              <div className="text-3xl mb-3">🔌</div>
              <p className="font-semibold">{cat}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="w-full px-6 md:px-10 lg:px-14 pb-16">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-bold text-lg">Quality Products</h3>
            <p className="text-gray-600 mt-2">
              Branded and reliable electrical items.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-bold text-lg">Best Price</h3>
            <p className="text-gray-600 mt-2">
              Affordable pricing for every customer.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="text-3xl mb-3">📞</div>
            <h3 className="font-bold text-lg">Quick Enquiry</h3>
            <p className="text-gray-600 mt-2">
              Reserve products or contact directly.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}