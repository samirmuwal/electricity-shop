import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");

    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      imageUrl: `/uploads/${fileName}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}