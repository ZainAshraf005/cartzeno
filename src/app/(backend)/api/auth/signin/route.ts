import { errorHandler } from "@/lib/handlers/error-handler";
import { loginSchema } from "@/schemas/user-schema";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/verify-password";
import { createToken } from "@/lib/jwt";
import { omit } from "lodash";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const result = loginSchema.parse(body);
    const { email, password } = result;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user)
      return NextResponse.json(
        { message: "user not found", success: false },
        { status: 404 }
      );
    const passwordMatch = await verifyPassword(
      user.password, // Hashed password
      password, // Password from user
      request
    );
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid Credentials", success: false },
        { status: 400 }
      );
    }
    const userWithoutPassword = omit(user, ["password"]);
    const token = createToken({ userId: user.id });
    const response = NextResponse.json(
      { user: userWithoutPassword, success: true },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return response;
  } catch (error: unknown) {
    return errorHandler(error, request);
  }
};
