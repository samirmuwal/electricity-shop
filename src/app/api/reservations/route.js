import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const reservations = await Reservation.find()
      .populate("product")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      reservations,
    });
  } catch (error) {
    console.log("GET Reservations Error:", error);

    return NextResponse.json(
      { success: false, reservations: [], error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const reservation = await Reservation.create({
      name: body.name,
      phone: body.phone,
      product: body.productId,
      quantity: body.quantity || 1,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      reservation,
    });
  } catch (error) {
    console.log("POST Reservations Error:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}