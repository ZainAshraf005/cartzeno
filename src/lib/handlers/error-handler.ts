// errorHandler.ts
import { ZodError } from "zod";
import { NextResponse } from "next/server";

export function errorHandler(error: unknown, request: Request) {
  // Log error only in development mode
  if (process.env.NODE_ENV === "development")
    console.error(`Error on ${request.method} ${request.url}:`, error);

  // Define a generic error response
  const response = {
    success: false,
    message: "An error occurred. Please try again later.",
    path: request.url, // Include the request URL in the response
  };

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        ...response,
        message: "Validation failed.",
        issues: error.errors.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  // Handle specific error types
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        ...response,
        message: "Invalid JSON payload.",
      },
      { status: 400 }
    );
  }

  if (error instanceof TypeError) {
    return NextResponse.json(
      {
        ...response,
        message: "A type error occurred. Check your input.",
      },
      { status: 400 }
    );
  }

  // Handle other cases, default to 500
  return NextResponse.json(
    {
      ...response,
      message: error instanceof Error ? error.message : response.message,
    },
    { status: 500 }
  );
}
