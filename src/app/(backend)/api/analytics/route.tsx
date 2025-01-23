import { isLoggedIn } from "@/lib/auth/isLoggedIn";
import { errorHandler } from "@/lib/handlers/error-handler";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (request: NextRequest) => {
  try {
    const decode = isLoggedIn(request);
    if (!decode)
      return NextResponse.json(
        { message: "un-authorized access", success: false },
        { status: 400 }
      );

    const user = await prisma.user.findMany();
    const product = await prisma.product.findMany();
    const order = await prisma.order.findMany();

    return NextResponse.json(
      {
        data: {
          users: user.length,
          products: product.length,
          orders: order.length,
        },
        success: true,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    errorHandler(error, request);
  }
};
