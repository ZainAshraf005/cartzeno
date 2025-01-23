import { NextRequest } from "next/server";
import { verifyToken } from "../jwt";

export const isLoggedIn = (request: NextRequest) => {
  const token = request.cookies.get("token");

  if (!token || !token.value) {
    return false;
  }
  try {
    const decode = verifyToken(token.value);
    return decode;
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") console.log(error);
    return false;
  }
};
