"use client";
import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import SignupSchema from "@/schemas/Signup.sche";
import { SignUpSchemaType } from "@/schemas/type";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const SignUp = () => {
  const router = useRouter();
  const [signUpEnabled, setSignupEnabled] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  type UserType = {
    email: string;
    password: string;
    username: string;
  };
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SignUpSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(SignupSchema),
  });
  const SignupUser = async (Formdata: UserType) => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL!}/user/signup`,
      Formdata
    );
    toast.success("User created successfully!");
    router.push("/login");
  };
  const { mutateAsync: signup, isPending } = useMutation({
    mutationFn: SignupUser,
  });
  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setSignupEnabled(true);
    } else {
      setSignupEnabled(false);
    }
  }, [user]);
  return (
    <div className="h-dvh w-screen flex justify-center items-center">
      <form
        className=" flex flex-col gap-5 p-10 w-[60%] h-fit border-1 border-gray-600 rounded mx-auto"
        onSubmit={handleSubmit(async (Formdata) => {
          await signup(Formdata);
        })}
      >
        <h1 className="text-center font-bold capitalize">
          {isPending ? "Processing.." : "Sign Up"}
        </h1>
        <div className="w-full">
          <TextField
            label="email"
            size="small"
            fullWidth
            type="text"
            value={user.email}
            {...register("email")}
            helperText={errors.email?.message}
            error={!!errors.email?.message}
            onChange={(e) =>
              setUser((user) => ({ ...user, email: e.target.value }))
            }
          />
        </div>
        <div>
          <TextField
            label="password"
            type="password"
            size="small"
            fullWidth
            value={user.password}
            {...register("password")}
            helperText={errors.password?.message}
            error={!!errors.password?.message}
            onChange={(e) =>
              setUser((user) => ({ ...user, password: e.target.value }))
            }
          />
        </div>
        <div>
          <TextField
            label="username"
            size="small"
            fullWidth
            type="text"
            value={user.username}
            {...register("username")}
            helperText={errors.username?.message}
            error={!!errors.username?.message}
            onChange={(e) =>
              setUser((user) => ({ ...user, username: e.target.value }))
            }
          />
        </div>
        <div className="w-full">
          <Button variant="contained" type="submit" fullWidth>
            {signUpEnabled
              ? `${isPending ? "loading.." : "signup"} `
              : "No signup"}
          </Button>
        </div>
        <div className="w-full flex justify-center">
          <Link
            className="text-sm text-gray-500 hover:text-blue-500 hover:underline hover:cursor-pointer text-center"
            href={"/login"}
          >
            Visit Login Page
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
