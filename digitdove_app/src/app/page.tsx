"use client";

import Image from "next/image";
import Home from "./pages/home/page";
import Navbar from "./components/SideNav";
import { useFormat } from "./providers/FormatContext";

export default function Main() {
  const { format } = useFormat();
  return (
    <main className="h-screen">
      <div
      >
        <Home />
      </div>
    </main>
  );
}
