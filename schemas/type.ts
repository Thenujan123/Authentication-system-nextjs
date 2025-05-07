import { z } from "zod";
import SignupSchema from "./Signup.sche";
import LoginSchema from "./Login.schema";

export type SignUpSchemaType = z.infer<typeof SignupSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
