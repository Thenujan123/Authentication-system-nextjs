import prisma from "@/lib/prisma";
import LoginSchema from "@/schemas/Login.schema";
import { NextRequest, NextResponse } from "next/server";
import { verify as VerifyPassword } from "argon2";
import handleError from "../../helpers";
import jwt from "jsonwebtoken";
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const ValidatedData = LoginSchema.parse(body);
    const user = await prisma.user.findFirst({
      where: { email: ValidatedData.email },
    });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "USER NOT FOUND",
        },
        { status: 404 }
      );
    }
    const InvalidCredentials = NextResponse.json(
      {
        success: false,
        message: "INVALID CREDENTIALS",
      },
      { status: 400 }
    );
    const PasswordVerify = await VerifyPassword(
      user.password,
      ValidatedData.password
    );
    if (!PasswordVerify) {
      return InvalidCredentials;
    }
    const tokenData = {
      id: user.id,
      username: user.username,
      password: user.password,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    const response = NextResponse.json(
      {
        message: "Login Successfull",
        sucess: true,
      },
      { status: 200 }
    );
    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error) {
    return handleError({ error, defaultError: "user login Problem" });
  }
};
