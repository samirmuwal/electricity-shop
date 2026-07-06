import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ShopSetting from "@/models/ShopSetting";
import { notFound } from "next/navigation";
import ReserveButton from "@/components/ReserveButton";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import AddToCartButton from "@/components/product/AddToCartButton";

export default async function ProductDetailsPage({ params }) {
  await connectDB();

  const { id } = await params;

  const product = await Product.findById(id).lean();
  const setting = await ShopSetting.findOne().lean();

  if (!product) {
    notFound();
  }

  const productId = product._id.toString();

  const whatsappNumber = setting?.whatsapp || "";
  const whatsappText = `Hello, I want to enquire about ${product.name}. Price: ₹${product.price}`;
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`
    : "#";

  return (
    <div className="w-full px-4 md:px-10 lg:px-14 py-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Left Column - Product Image Gallery */}
        <div className="w-full">
          <ProductGallery product={product} />
        </div>

        {/* Right Column - Product Info and Actions grouped together */}
        <div className="flex flex-col gap-6">
          <ProductInfo product={product} />

          {/* Checkout & WhatsApp actions */}
          <div className="bg-white rounded-2xl shadow p-6 border">
            <h3 className="font-bold text-gray-800 mb-4 text-base border-b pb-2">
              Purchase & Reservation
            </h3>

            <div className="space-y-3">
              <AddToCartButton product={product} />

              {whatsappNumber && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition text-sm shadow-sm"
                >
                  💬 Inquire on WhatsApp
                </a>
              )}
            </div>

            {/* Inline single reservation form */}
            <ReserveButton productId={productId} />
          </div>
        </div>
      </div>
    </div>
  );
}