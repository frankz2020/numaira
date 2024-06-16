"use client"
import React from "react";
import { useGlobalContext } from "@/app/providers/GlobalContext";
import { useRouter } from "next/navigation";
const Login = () => {
    const router = useRouter()
  const { setLoggedIn } = useGlobalContext();
  return (
    <div className="flex justify-center">
      <div className="flex justify-center flex-col">
        <div className="text-xl text-bold text-center pt-5"> Log in </div>
        <div className="text-sm">
          Welcome back! Please enter your credentials{" "}
        </div>
        <input placeholder="Your email..." type="email" />
        <input placeholder="Password..." type="password" />
        <div
          onClick={() => {
            setLoggedIn(true)
            router.push("/home")
          }}
        >
          Log in
        </div>
      </div>
    </div>
  );
};

export default Login;
