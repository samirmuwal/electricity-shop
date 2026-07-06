import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// GET /api/orders - Get orders (Admin gets all, User gets their own)
export async function GET(req) {
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

    let orders;
    if (token.role === "admin") {
      orders = await Order.find()
        .populate("items.product")
        .sort({ createdAt: -1 });
    } else {
      const userId = token.sub || token.id;
      orders = await Order.find({ user: userId })
        .populate("items.product")
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET Orders Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(req) {
  try {
    await connectDB();

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const body = await req.json();
    const {
      name,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      items,
      paymentMethod,
    } = body;

    if (!name || !phone || !address || !city || !state || !pincode || !items || !items.length) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify products and compute total amount
    let computedTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item._id || item.product);

      if (!dbProduct) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.name}` },
          { status: 404 }
        );
      }

      // Check stock
      const requestedQty = Number(item.quantity || 1);
      const currentStock = Number(dbProduct.stock || 0);

      if (currentStock < requestedQty) {
        return NextResponse.json(
          {
            success: false,
            error: `Not enough stock available for ${dbProduct.name}. Available: ${currentStock}, Requested: ${requestedQty}`,
          },
          { status: 400 }
        );
      }

      const itemPrice = dbProduct.salePrice > 0 ? dbProduct.salePrice : dbProduct.price;
      computedTotal += itemPrice * requestedQty;

      verifiedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: itemPrice,
        quantity: requestedQty,
      });
    }

    // Determine stock deduction
    // Since payment might be mock or COD, we deduct stock immediately to prevent double-booking
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const orderData = {
      name,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      items: verifiedItems,
      totalAmount: computedTotal,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "Razorpay" ? "paid" : "pending", // Mock Razorpay as immediately paid
      status: "pending",
      stockReduced: true,
    };

    if (token) {
      orderData.user = token.sub || token.id;
    }

    const order = await Order.create(orderData);

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("POST Orders Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
