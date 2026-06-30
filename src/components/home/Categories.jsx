import Link from "next/link";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";


export default async function Categories() {
  await connectDB();

  const categories = await Category.find({
    isActive: true,
  }).sort({
    order: 1,
    name: 1,
  });
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">
            Shop By Category
          </h2>

          <p className="text-gray-500 mt-3">
            Explore premium electrical products
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-7">

          {categories.map((cat) => (

            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group"
            >

              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl h-48 flex flex-col justify-center items-center text-white shadow-lg hover:scale-105 transition-all duration-300">

                <div className="text-6xl group-hover:scale-110 transition">
  ⚡
</div>

                <h3 className="font-bold text-xl mt-5">
                  {cat.name}
                </h3>

              </div>

            </Link>

          ))}

        </div>

      </div>
    </section>
  );
}