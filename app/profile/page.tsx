"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [Loading, setLoading] = useState(false);
  const router = useRouter();
  const LogoutUser = async () => {
    try {
      setLoading(true);
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL!}/user/logout`);
      toast.success("User Logout successfully");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-5 w-fit">
      Profile Page
      <button
        type="button"
        className="px-4 py-2 bg-blue-500 rounded text-white cursor-pointer"
        onClick={() => LogoutUser()}
      >
        {Loading ? "Loading..." : " Logout"}
      </button>
    </div>
  );
};

export default Page;
