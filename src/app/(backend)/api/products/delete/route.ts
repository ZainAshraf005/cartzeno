import { errorHandler } from "@/lib/handlers/error-handler";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const POST = async (request: NextRequest) => {
  try {
    const { id } = await request.json();
    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    const category = await prisma.category.findUnique({
      where: { id: product.categoryId },
    });
    const categoryName = category?.name as string;
    const productTitle = product.title;

    // Delete related entities and the product in a transaction
    await prisma.$transaction([
      prisma.orderItem.deleteMany({ where: { productId: id } }),
      prisma.cartItem.deleteMany({ where: { productId: id } }),
      prisma.review.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

    const productDir = path.join(
      process.cwd(),
      "public",
      "categories",
      categoryName,
      productTitle
    );

    try {
      await fs.access(productDir);

      await fs.rm(productDir, { recursive: true, force: true });
    } catch (error) {
      if (
        error instanceof Error &&
        (error as NodeJS.ErrnoException).code !== "ENOENT"
      ) {
        throw error;
      }
    }

    return NextResponse.json(
      { message: "Product and related data deleted successfully." },
      { status: 201 }
    );
  } catch (error: unknown) {
    errorHandler(error, request);
  }
};
