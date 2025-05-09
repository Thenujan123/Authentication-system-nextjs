import { NextResponse } from "next/server";
import handleError from "../../helpers";

export const GET = async () => {
  try {
    const response = NextResponse.json({
      success: true,
      message: "successfully logout user",
    });
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return response;
  } catch (error) {
    return handleError({ error, defaultError: "Failed to Logout User" });
  }
};
