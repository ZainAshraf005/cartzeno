import { isLoggedIn } from "@/lib/auth/isLoggedIn";
import { errorHandler } from "@/lib/handlers/error-handler";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { omit } from "lodash";

interface LoginResult {
  userId: string;
}

export const POST = async (request: NextRequest) => {
  try {
    const result = isLoggedIn(request) as LoginResult;

    // Check if result is null or undefined
    if (!result || !("userId" in result)) {
      return NextResponse.json(
        { message: "un-authorized access", success: false },
        { status: 400 }
      );
    }

    const { userId } = result; // Now it's safe to access userId
    const users = await prisma.user.findMany();
    const newUsers = users.filter((item) => item.id !== userId);
    const finalUsers = newUsers.map((obj) => omit(obj, ["password"]));

    return NextResponse.json(
      { success: true, users: finalUsers },
      { status: 201 }
    );
  } catch (error: unknown) {
    errorHandler(error, request);
  }
};
