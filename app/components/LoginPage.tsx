"use client";
import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import LoginSchema from "@/schemas/Login.schema";
import { LoginSchemaType } from "@/schemas/type";
const LoginPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<LoginSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(LoginSchema),
  });
  return (
    <div className="h-dvh w-screen flex justify-center items-center">
      <form
        className=" flex flex-col gap-5 p-10 w-[60%] h-fit border-1 border-gray-600 rounded mx-auto"
        onSubmit={handleSubmit((Formdata) => {
          console.log(Formdata);
        })}
      >
        <h1 className="text-center font-bold capitalize">Sign Up</h1>
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
            Signup
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
