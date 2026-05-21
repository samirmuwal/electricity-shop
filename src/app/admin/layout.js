import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}