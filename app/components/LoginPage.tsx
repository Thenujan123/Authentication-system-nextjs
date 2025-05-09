"use client";
import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import LoginSchema from "@/schemas/Login.schema";
import { LoginSchemaType } from "@/schemas/type";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
const LoginPage = () => {
  const router = useRouter();
  const [loginEnable, setLoginEnable] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  type LoginUserType = {
    email: string;
    password: string;
  };

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<LoginSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(LoginSchema),
  });
  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setLoginEnable(true);
    } else {
      setLoginEnable(false);
    }
  }, [user]);
  const LoginUSer = async (Formdata: LoginUserType) => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL!}/user/login`,
      Formdata
    );
    router.push("/profile");
    toast.success("User Login Successfully");
  };
  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: LoginUSer,
  });
  return (
    <div className="h-dvh w-screen flex justify-center items-center">
      <form
        className=" flex flex-col gap-5 p-10 w-[60%] h-fit border-1 border-gray-600 rounded mx-auto"
        onSubmit={handleSubmit(async (Formdata) => {
          await login(Formdata);
        })}
      >
        <h1 className="text-center font-bold capitalize">
          {isPending ? "PRocessing" : "Login"}
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

        <div className="w-full">
          <Button variant="contained" type="submit" fullWidth>
            {loginEnable ? "Login" : "no Login"}
          </Button>
        </div>
        <div className="w-full flex justify-center">
          <Link
            className="text-sm text-gray-500 hover:text-blue-500 hover:underline hover:cursor-pointer text-center"
            href={"/signup"}
          >
            Visit Signup Page
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
