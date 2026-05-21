import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import ReserveButton from "@/components/ReserveButton";

export default async function ProductDetailsPage({ params }) {
  await connectDB();

  const { id } = await params;

  const product = await Product.findById(id).lean();

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto p-8 grid md:grid-cols-2 gap-10">
      <img
        src={product.image || "/placeholder.png"}
        alt={product.name}
        className="w-full h-[400px] object-cover rounded-xl shadow"
      />

      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="text-2xl font-bold mt-3">₹{product.price}</p>

        <p className="mt-2">Stock: {product.stock}</p>
        <p>Brand: {product.brand}</p>
        <p>Watt: {product.watt}</p>
        <p>Voltage: {product.voltage}</p>

        <p className="mt-4 text-gray-600">{product.description}</p>

        <ReserveButton productId={product._id.toString()} />
      </div>
    </div>
  );
}