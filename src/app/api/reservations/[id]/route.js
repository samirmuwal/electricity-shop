import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();
    const newStatus = body.status;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return NextResponse.json(
        { success: false, error: "Reservation not found" },
        { status: 404 }
      );
    }

    // confirm karte time stock reduce
    if (newStatus === "confirmed" && !reservation.stockReduced) {
      const product = await Product.findById(reservation.product);

      if (!product) {
        return NextResponse.json(
          { success: false, error: "Product not found" },
          { status: 404 }
        );
      }

      if (Number(product.stock) < Number(reservation.quantity)) {
        return NextResponse.json(
          { success: false, error: "Not enough stock available" },
          { status: 400 }
        );
      }

      product.stock = Number(product.stock) - Number(reservation.quantity);
      await product.save();

      reservation.stockReduced = true;
    }

    reservation.status = newStatus;
    await reservation.save();

    return NextResponse.json({
      success: true,
      reservation,
    });
  } catch (error) {
    console.log("Update reservation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}