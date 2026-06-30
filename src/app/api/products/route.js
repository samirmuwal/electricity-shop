import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });

  return NextResponse.json({
    success: true,
    products,
  });
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // Auto slug generate
    const slug = body.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const product = await Product.create({
      ...body,
      slug,
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}