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
  await connectDB();
  const body = await req.json();

  const product = await Product.create(body);

  return NextResponse.json({
    success: true,
    product,
  });
}