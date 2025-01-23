import { errorHandler } from "@/lib/handlers/error-handler";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isLoggedIn } from "@/lib/auth/isLoggedIn";

export const POST = async (request: NextRequest) => {
  try {
    const decode = isLoggedIn(request);
    if (!decode)
      return NextResponse.json(
        { message: "Unauthorized access", success: false },
        { status: 401 }
      );

    if (typeof decode !== "object" || !("userId" in decode))
      return NextResponse.json(
        { message: "Invalid token", success: false },
        { status: 400 }
      );

    const { id } = await request.json();
    if (!id)
      return NextResponse.json(
        { message: "Missing user ID", success: false },
        { status: 422 }
      );

    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists)
      return NextResponse.json(
        { message: "Invalid user ID", success: false },
        { status: 400 }
      );

    const allOrders = await prisma.order.findMany({ where: { userId: id } });
    const allCarts = await prisma.cart.findMany({ where: { userId: id } });

    await prisma.$transaction(async (prisma) => {
      await prisma.orderItem.deleteMany({
        where: { orderId: { in: allOrders.map((o) => o.id) } },
      });
      await prisma.order.deleteMany({ where: { userId: id } });
      await prisma.cartItem.deleteMany({
        where: { cartId: { in: allCarts.map((c) => c.id) } },
      });
      await prisma.cart.deleteMany({ where: { userId: id } });
      await prisma.review.deleteMany({ where: { userId: id } });
      await prisma.address.deleteMany({ where: { userId: id } });
      await prisma.user.delete({ where: { id } });
    });

    const response = NextResponse.json({ success: true }, { status: 201 });
    if (id === decode.userId)
      response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      });

    return response;
  } catch (error: unknown) {
    console.log(error);
    errorHandler(error, request);
  }
};
