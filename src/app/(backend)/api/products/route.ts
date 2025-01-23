import { isLoggedIn } from "@/lib/auth/isLoggedIn";
import { errorHandler } from "@/lib/handlers/error-handler";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const POST = async (request: NextRequest) => {
  try {
    const decode = isLoggedIn(request);
    if (!decode)
      return NextResponse.json(
        { message: "un-authorized access", success: false },
        { status: 400 }
      );

    const { title } = await request.json();
    if (!title)
      return NextResponse.json(
        { message: "missing id", success: false },
        { status: 400 }
      );
    const prodTitle = title.trim().replaceAll("-", " ") as string;

    const productExists = await prisma.product.findFirst({
      where: { title: prodTitle },
      include: { category: true, Review: true },
    });
    if (!productExists)
      return NextResponse.json(
        { message: "invalid product data", success: false },
        { status: 400 }
      );
    return NextResponse.json({ product: productExists, success: true });
  } catch (error: unknown) {
    errorHandler(error, request);
  }
};
