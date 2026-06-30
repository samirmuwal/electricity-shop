import Link from "next/link";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export default async function FeaturedProducts() {
  await connectDB();

  const products = await Product.find()
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-bold">
              Featured Products
            </h2>
            <p className="text-gray-500 mt-2">
              Best selling electrical products
            </p>
          </div>

          <Link
            href="/products"
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

          {products.map((product) => (

            <Link
              key={product._id.toString()}
              href={`/products/${product._id}`}
            >
              <div className="bg-white rounded-3xl shadow hover:shadow-xl transition overflow-hidden group">

                <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden">

                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="h-44 object-contain group-hover:scale-110 transition"
                  />

                </div>

                <div className="p-5">

                  <h3 className="font-bold line-clamp-2 min-h-[52px]">
                    {product.name}
                  </h3>

                  <p className="text-orange-600 font-bold text-xl mt-3">
                    ₹ {product.price}
                  </p>

                  <button className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold">
                    View Product
                  </button>

                </div>

              </div>
            </Link>

          ))}

        </div>

      </div>
    </section>
  );
}