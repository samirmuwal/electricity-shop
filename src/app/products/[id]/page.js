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

  const productId = product._id.toString();

  const whatsappNumber = "7073357475"; // yaha apna WhatsApp number lagao
  const whatsappText = `Hello, I want to enquire about ${product.name}. Price: ₹${product.price}`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappText
  )}`;

  return (
    <div className="w-full px-6 md:px-10 lg:px-14 py-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="h-[420px] bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
            <img
              src={product.image || "/placeholder.png"}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            {product.category || "Product"}
          </span>

          <h1 className="text-3xl font-bold mt-4">{product.name}</h1>

          <p className="text-3xl font-bold mt-3">₹{product.price}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="border rounded-lg p-3">
              <p className="text-gray-500">Brand</p>
              <p className="font-semibold">{product.brand || "N/A"}</p>
            </div>

            <div className="border rounded-lg p-3">
              <p className="text-gray-500">Stock</p>
              <p className="font-semibold">{product.stock || "0"}</p>
            </div>

            <div className="border rounded-lg p-3">
              <p className="text-gray-500">Watt</p>
              <p className="font-semibold">{product.watt || "N/A"}</p>
            </div>

            <div className="border rounded-lg p-3">
              <p className="text-gray-500">Voltage</p>
              <p className="font-semibold">{product.voltage || "N/A"}</p>
            </div>
          </div>

          <p className="mt-5 text-gray-600 leading-relaxed">
            {product.description || "No description available."}
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
  <div className="w-full">
    <ReserveButton productId={productId} />
  </div>

  <a
    href={whatsappLink}
    target="_blank"
    rel="noopener noreferrer"
    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2 font-semibold shadow-sm transition"
  >
    <span className="text-lg">💬</span>
    <span>WhatsApp Enquiry</span>
  </a>
</div>
        </div>
      </div>
    </div>
  );
}