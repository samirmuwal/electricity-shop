import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  await connectDB();

  const { id } = await params;

  await Product.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
  });
}

export async function PUT(req, { params }) {
  await connectDB();

  const { id } = await params;
  const body = await req.json();

  await Product.findByIdAndUpdate(id, body);

  return NextResponse.json({
    success: true,
  });
}