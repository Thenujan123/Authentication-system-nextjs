import { NextResponse } from "next/server";
import { ZodError } from "zod";

const handleError = ({
  error,
  defaultError,
}: {
  error: any;
  defaultError: string;
}) => {
  console.log(error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: "VALIDATION FAILED",
        error: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }
  return NextResponse.json(
    {
      success: false,
      message: "INTERNAL SERVER ERROR" + defaultError,
    },
    { status: 500 }
  );
};
export default handleError;
