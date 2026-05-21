import AdminProductsTable from "@/components/AdminProductsTable";

async function getProducts() {
  try {
    const res = await fetch("http://localhost:3000/api/products", {
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, products: [] };
    }

    return await res.json();
  } catch (error) {
    console.log("Fetch products error:", error);
    return { success: false, products: [] };
  }
}

export default async function AdminProductsPage() {
  const data = await getProducts();
  const products = data.products || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>

        <a
          href="/admin/add-product"
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Add Product
        </a>
      </div>

      <AdminProductsTable products={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}