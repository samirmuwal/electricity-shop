import AdminProductsTable from "@/components/AdminProductsTable";

export default function AdminProductsPage() {
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

      <AdminProductsTable />
    </div>
  );
}