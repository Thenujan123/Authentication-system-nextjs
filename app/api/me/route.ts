import { NextRequest, NextResponse } from "next/server";
import handleError from "../helpers";
import privateRoute from "../privateRoute";
import prisma from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
  try {
    return await privateRoute(req, async (user) => {
      const userID = user.id;
      const userData = await prisma.user.findFirst({
        where: { id: userID },
        select: { username: true, email: true },
      });
      return NextResponse.json(
        {
          success: true,
          userData,
        },
        { status: 200 }
      );
    });
  } catch (error) {
    return handleError({ error, defaultError: "failed to get Who am I" });
  }
};
