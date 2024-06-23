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
        style={{
          paddingLeft: format.sideNavbarWidth,
          paddingTop: format.topNavbarHeight,
          height: `calc(100vh - ${format.topNavbarHeight})`,
          width: `calc(100vw - ${format.sideNavbarWidth})`,
        }}
      >
        <Home />
      </div>
    </main>
  );
}
