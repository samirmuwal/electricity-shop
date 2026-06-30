import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Brand from "@/models/Brand";

export async function GET() {
  try {
    await connectDB();

    const brands = await Brand.find({ isActive: true }).sort({
      name: 1,
    });

    return NextResponse.json({
      success: true,
      brands,
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

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const slug = body.name
      .toLowerCase()
      .replace(/\s+/g, "-");

    const brand = await Brand.create({
      ...body,
      slug,
    });

    return NextResponse.json({
      success: true,
      brand,
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