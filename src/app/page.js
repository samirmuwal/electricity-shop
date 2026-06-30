import Link from "next/link";
import { connectDB } from "@/lib/db";
import ShopSetting from "@/models/ShopSetting";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
export const dynamic = "force-dynamic";

export default async function Home() {
  await connectDB();

  const setting = await ShopSetting.findOne().lean();

  const shopName = setting?.shopName || "Electric Shop";
  const logo = setting?.logo || "";
  const whatsapp = setting?.whatsapp || "";

  

  return (
    <main className="bg-gray-50 min-h-screen">
<Hero
  shopName={shopName}
  whatsapp={whatsapp}
/>

      <Categories />

      <FeaturedProducts />
    </main>
  );
}