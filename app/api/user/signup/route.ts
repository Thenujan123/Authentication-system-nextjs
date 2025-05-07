import { NextRequest, NextResponse } from "next/server";
import handleError from "../../helpers";
import prisma from "@/lib/prisma";
import SignupSchema from "@/schemas/Signup.sche";
import { hash } from "argon2";
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedData = SignupSchema.parse(body);
    const hasedPassword = await hash(validatedData.password);
    const isUSerExist = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (isUSerExist) {
      return NextResponse.json(
        {
          success: false,
          code: "USER-DUPLICATED",
          message: "USER ALREADY EXIST",
        },
        { status: 409 }
      );
    }
    const newUser = await prisma.user.create({
      data: { ...validatedData, password: hasedPassword },
    });
    return NextResponse.json(
      {
        successs: true,
        message: "User Logged Successfully",
        newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError({ error, defaultError: "failded to Login User" });
  }
};
