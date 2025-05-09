import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

type User = { id: string };

export default async function privateRoute(
  req: NextRequest,
  cb: (user: User) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { code: "user-not-authorized", message: "You are not authorized" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { code: "server-error", message: "JWT secret not configured" },
        { status: 500 }
      );
    }

    jwt.verify(token, secret);
    const decoded = jwt.verify(token, secret) as JwtPayload & User;

    return cb({ id: decoded.id });
  } catch (error) {
    const err = error as jwt.JsonWebTokenError;

    console.log({ name: err.name });

    if (err.name === "JsonWebTokenError") {
      return NextResponse.json(
        {
          code: "invalid-token",
          message: "The token you provided is not valid.",
        },
        { status: 401 }
      );
    }

    if (err.name === "TokenExpiredError") {
      return NextResponse.json(
        {
          code: "token-expired",
          message: "The token you provided has expired.",
        },
        { status: 401 }
      );
    }

    // Fallback error
    return NextResponse.json(
      { code: "unknown-error", message: "Something went wrong." },
      { status: 500 }
    );
  }
}
