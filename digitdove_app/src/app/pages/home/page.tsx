"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers/ThemeContext";
import Demo from "@/app/components/Demo/demo";
import Navbar from "@/app/components/Navbar";
import { useGlobalContext } from "@/app/providers/GlobalContext";
const Home = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const {user} = useGlobalContext()
  return (
    <div className="flex h-full w-full " style={{width: "100%"}}>
      <div className="grow">
        <button onClick={() => router.push("/about")}>Go to About </button>
        <div className="m-20">
          <p>Home testing</p>
          <h1 style={{ color: theme.primary }}>Hello, World!</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
