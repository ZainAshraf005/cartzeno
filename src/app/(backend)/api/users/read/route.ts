import { isLoggedIn } from "@/lib/auth/isLoggedIn";
import { errorHandler } from "@/lib/handlers/error-handler";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface UserId {
  userId: string;
}

export const GET = async (request: NextRequest) => {
  try {
    const decode = isLoggedIn(request);

    // Handle different return types
    if (!decode || typeof decode === "string" || !("userId" in decode)) {
      return NextResponse.json(
        { message: "Unauthorized access", success: false },
        { status: 401 }
      );
    }

    const { userId } = decode as UserId; // Safely cast after narrowing

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true, // Select only the fields you want to return
      },
    });

    if (!userExists) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User retrieved successfully",
      success: true,
      user: userExists,
    });
  } catch (error: unknown) {
    errorHandler(error, request);
  }
};
