import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-black text-white p-6 hidden md:block min-h-screen">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

      <nav className="flex flex-col gap-4">
        <Link href="/admin/dashboard">Dashboard</Link>
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/add-product">Add Product</Link>
        <Link href="/admin/reservations">Reservations</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/products">View Website</Link>
      </nav>
    </aside>
  );
}