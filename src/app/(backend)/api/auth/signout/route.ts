import {  NextResponse } from "next/server";

export const GET = async () => {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
};
