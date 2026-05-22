import ReservationsTable from "@/components/ReservationsTable";

export default function AdminReservationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reservations</h1>
      <ReservationsTable />
    </div>
  );
}