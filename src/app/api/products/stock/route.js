import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function PATCH(req) {
  try {
    await connectDB();

    // Authenticate and authorize admin
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { updates } = body; // Array of { id, stock }

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: "Invalid updates format. Array expected." },
        { status: 400 }
      );
    }

    // Process updates in parallel
    const updatePromises = updates.map((update) => {
      const { id, stock } = update;
      return Product.findByIdAndUpdate(
        id,
        { stock: Number(stock) },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: "Stock updated successfully!",
    });
  } catch (error) {
    console.error("PATCH Stock Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
