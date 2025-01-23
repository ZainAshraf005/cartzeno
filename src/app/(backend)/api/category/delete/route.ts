import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { errorHandler } from "@/lib/handlers/error-handler";
import fs from "fs/promises";
import path from "path";

export const POST = async (request: NextRequest) => {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "missing category ID", success: false },
        { status: 400 }
      );
    }

    // Check if the category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { message: "Invalid category ID", success: false },
        { status: 400 }
      );
    }

    // Delete products linked to the category
    await prisma.product.deleteMany({ where: { categoryId: id } });

    const categoryDir = path.join(
      process.cwd(),
      "public",
      "categories",
      categoryExists.name.trim().toLowerCase().replace(/\s+/g, "-")
    );
    try {
      await fs.access(categoryDir);

      await fs.rm(categoryDir, { recursive: true, force: true });
    } catch (error) {
      if (
        error instanceof Error &&
        (error as NodeJS.ErrnoException).code !== "ENOENT"
      ) {
        throw error;
      }
    }

    // Delete the category
    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    errorHandler(error, request);
  }
};
