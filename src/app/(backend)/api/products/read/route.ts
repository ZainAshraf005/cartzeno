import { errorHandler } from "@/lib/handlers/error-handler";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (request: NextRequest) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, Review: true },
    });
    return NextResponse.json({ products, success: true }, { status: 200 });
  } catch (error: unknown) {
    errorHandler(error, request);
  }
};
