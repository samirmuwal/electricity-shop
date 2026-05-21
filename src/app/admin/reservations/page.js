import ReservationsTable from "@/components/ReservationsTable";

async function getReservations() {
  try {
    const res = await fetch("http://localhost:3000/api/reservations", {
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, reservations: [] };
    }

    return await res.json();
  } catch (error) {
    console.log("Fetch reservations error:", error);
    return { success: false, reservations: [] };
  }
}

export default async function ReservationsPage() {
  const data = await getReservations();
  const reservations = data.reservations || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reservations</h1>

      <ReservationsTable
        reservations={JSON.parse(JSON.stringify(reservations))}
      />
    </div>
  );
}