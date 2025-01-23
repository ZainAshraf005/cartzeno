import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY!;

export const createToken = (payload: object, expiresIn = "1d") => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

export const verifyToken = (token: string) => {
  try {
    const decode = jwt.verify(token, SECRET_KEY);
    return decode;
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") console.log(error);
    return false;
  }
};
