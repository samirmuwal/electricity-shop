import { connectDB } from "@/lib/db";
import ShopSetting from "@/models/ShopSetting";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    let setting = await ShopSetting.findOne();

    if (!setting) {
      setting = await ShopSetting.create({});
    }

    return NextResponse.json({
      success: true,
      setting,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();

    let setting = await ShopSetting.findOne();

    if (!setting) {
      setting = await ShopSetting.create(body);
    } else {
      setting = await ShopSetting.findByIdAndUpdate(setting._id, body, {
        new: true,
      });
    }

    return NextResponse.json({
      success: true,
      setting,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update settings" },
      { status: 500 }
    );
  }
}