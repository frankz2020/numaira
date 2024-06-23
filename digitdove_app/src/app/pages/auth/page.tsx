"use client"
import React from "react";
import { useGlobalContext } from "@/app/providers/GlobalContext";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const { setLoggedIn } = useGlobalContext();

  return (
    <div className="flex justify-center">
      <div className="flex justify-center flex-col w-64 p-4 bg-gray-100 rounded-lg shadow-md">
        <div className="text-xl font-bold text-center pt-5">Log in</div>
        <div className="text-sm text-center py-2">
          Welcome back! Please enter your credentials
        </div>
        <input
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your email..."
          type="email"
        />
        <input
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password..."
          type="password"
        />
        <button
          className="w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          onClick={() => {
            setLoggedIn(true);
            router.push("/home");
          }}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default Login;
