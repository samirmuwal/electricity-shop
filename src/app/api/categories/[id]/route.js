import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete category",
      },
      { status: 500 }
    );
  }
}
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const category = await Category.findByIdAndUpdate(
      id,
      { name: body.name },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update category",
      },
      { status: 500 }
    );
  }
}