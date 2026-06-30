import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-6 overflow-x-hidden min-h-screen">
        {children}
      </main>
    </div>
  );
}