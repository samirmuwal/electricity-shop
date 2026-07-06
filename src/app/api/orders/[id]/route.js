import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus } = body;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Authorization: User can only cancel their own order, Admin can do anything
    const userId = token.sub || token.id;
    const isAdmin = token.role === "admin";
    const isOwner = order.user && order.user.toString() === userId.toString();

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: "Unauthorized operation" },
        { status: 403 }
      );
    }

    // Cancel order & restore stock
    if (status === "cancelled" && order.status !== "cancelled") {
      if (order.stockReduced) {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
        order.stockReduced = false;
      }
      order.status = "cancelled";
    } else if (status) {
      order.status = status;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order updated successfully!",
      order,
    });
  } catch (error) {
    console.error("PATCH Order error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
