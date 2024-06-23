"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/providers/ThemeContext";
import Demo from "@/app/components/Demo/demo";
import Navbar from "@/app/components/SideNav";
import { useGlobalContext } from "@/app/providers/GlobalContext";
import TemplateCard from "../template/templateCard";
import { useFormat } from "@/app/providers/FormatContext";
const Home = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const {format} = useFormat();
  const {user} = useGlobalContext()
  return (
    <div className="flex h-full w-full p-3" style={{width: "100%"}}>
      <div className="grow">
        <div className="flex justify-between p-2 align-center">
          <div className="align-center" style={{fontSize: format.displaySM}}>
          Welcome to DigitDove
          </div>
          
          <button onClick={() => router.push("/template")} className="bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded align-center">
            Select a new template
          </button>
        </div>
        <hr className="p-2"/>
        <div>
          <div style={{fontSize: format.displaySM}}>
          Recent files: 
          </div>
         <div className="flex pb-3 gap-4">
         <TemplateCard title="Test" description="This is a test card"/>
         <TemplateCard title="Test" description="This is a test card"/>
         <TemplateCard title="Test" description="This is a test card"/>
         </div>
         
        </div>
        <hr className="p-2"/>
        <div className="m-20">
          <p>Home testing</p>
          <h1 style={{ color: theme.primary }}>Hello, World!</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
