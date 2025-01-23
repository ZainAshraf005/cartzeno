import argon2 from "argon2";
import { errorHandler } from "../handlers/error-handler";
import { NextRequest } from "next/server";

export const verifyPassword = async (
  hash: string,
  password: string,
  request: NextRequest
): Promise<boolean> => {
  try {
    if (await argon2.verify(hash, password)) return true;
    else return false;
  } catch (error: unknown) {
    errorHandler(error, request);
    return false;
  }
};
