import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/hash-password";
import { errorHandler } from "@/lib/handlers/error-handler";
import { signupSchema } from "@/schemas/user-schema";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const result = signupSchema.parse(body);

    const { fullName, email, password } = result;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists)
      return NextResponse.json(
        { message: "user already exists", succuess: false },
        { status: 400 }
      );
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
      },
    });
    return NextResponse.json({ user, success: true }, { status: 201 });
  } catch (error: unknown) {
    return errorHandler(error, request);
  }
};
