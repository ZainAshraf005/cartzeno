import { errorHandler } from "@/lib/handlers/error-handler";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export const POST = async (request: NextRequest) => {
  try {
    const { category } = await request.json();
    if (!category)
      return NextResponse.json({ success: false }, { status: 400 });
    const categoryExists = await prisma.category.findUnique({
      where: { name: category },
    });
    if (categoryExists)
      return NextResponse.json(
        { message: "category already exists", success: false },
        { status: 400 }
      );
    await prisma.category.create({
      data: { name: category.trim().toLowerCase() },
    });
    const publicDir = path.join(process.cwd(), "public", "categories");
    await fs.mkdir(publicDir, { recursive: true });
    let samCategory = category;
    samCategory = samCategory.trim().toLowerCase();
    const formattedName = samCategory.replace(/\s+/g, "-");
    const newCategoryDir = path.join(publicDir, formattedName);
    await fs.mkdir(newCategoryDir, { recursive: true });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    errorHandler(error, request);
  }
};

export const GET = async (request: NextRequest) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, categories }, { status: 201 });
  } catch (error: unknown) {
    errorHandler(error, request);
  }
};
