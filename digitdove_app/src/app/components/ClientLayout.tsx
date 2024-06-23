"use client";
import React, { useEffect, useState } from "react";
import SideNav from "./SideNav";
import { useFormat } from "../providers/FormatContext";
import { useGlobalContext } from "../providers/GlobalContext";
import { useRouter } from "next/navigation";
import TopNav from "./TopNav";
const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { format } = useFormat();
  const {
    sideNavbarWidth,
    topNavbarHeight,
    maxSideNavbarWidth,
    maxTopNavbarHeight,
    minSideNavbarWidth,
    minTopNavbarHeight,
  } = format;
  const { loggedIn } = useGlobalContext();
  const router = useRouter();

  const [actualSideNavbarWidth, setActualSideNavbarWidth] = useState("0px");
  const [actualTopNavbarHeight, setActualTopNavbarHeight] = useState("0px");

  const calculateSideNavbarWidth = () => {
    const sideNavbarWidthPx =
      typeof sideNavbarWidth === "string" && sideNavbarWidth.endsWith("%")
        ? (parseFloat(sideNavbarWidth) / 100) * window.innerWidth
        : parseFloat(sideNavbarWidth);

    const maxSideNavbarWidthPx =
      typeof maxSideNavbarWidth === "string" &&
      maxSideNavbarWidth.endsWith("px")
        ? parseFloat(maxSideNavbarWidth)
        : parseFloat(maxSideNavbarWidth);

    const minSideNavbarWidthPx =
      typeof minSideNavbarWidth === "string" &&
      minSideNavbarWidth.endsWith("px")
        ? parseFloat(minSideNavbarWidth)
        : parseFloat(minSideNavbarWidth);

    return Math.max(
      minSideNavbarWidthPx,
      Math.min(sideNavbarWidthPx, maxSideNavbarWidthPx)
    );
  };

  const calculateTopNavbarHeight = () => {
    const topNavbarHeightPx =
      typeof topNavbarHeight === "string" && topNavbarHeight.endsWith("%")
        ? (parseFloat(topNavbarHeight) / 100) * window.innerHeight
        : parseFloat(topNavbarHeight);

    const maxTopNavbarHeightPx =
      typeof maxTopNavbarHeight === "string" &&
      maxTopNavbarHeight.endsWith("px")
        ? parseFloat(maxTopNavbarHeight)
        : parseFloat(maxTopNavbarHeight);

    const minTopNavbarHeightPx =
      typeof minTopNavbarHeight === "string" &&
      minTopNavbarHeight.endsWith("px")
        ? parseFloat(minTopNavbarHeight)
        : parseFloat(minTopNavbarHeight);

    return Math.max(
      minTopNavbarHeightPx,
      Math.min(topNavbarHeightPx, maxTopNavbarHeightPx)
    );
  };

  useEffect(() => {
    const handleResize = () => {
      const width = calculateSideNavbarWidth();
      const height = calculateTopNavbarHeight();
      setActualSideNavbarWidth(`${width}px`);
      setActualTopNavbarHeight(`${height}px`);
    };

    handleResize(); // Set initial width and height
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    sideNavbarWidth,
    topNavbarHeight,
    maxSideNavbarWidth,
    maxTopNavbarHeight,
    minSideNavbarWidth,
    minTopNavbarHeight,
  ]);

  useEffect(() => {
    if (!loggedIn) {
      router.push("/auth");
    }
  }, [loggedIn]);

  return (
    <>
      {" "}
      {loggedIn ? (
        <div>
          {" "}
          <div className=" relative h-screen hidden lg:block">
            
            {/* Main Content */}
            <div
              className="relative z-0"
              style={{
                left: actualSideNavbarWidth,
                top: actualTopNavbarHeight,
                height: `calc(100vh - ${actualTopNavbarHeight})`,
                width: `calc(100vw - ${actualSideNavbarWidth})`,
              }}
            >
              {children}
            </div>

            {/* Top Navbar */}
            <div className="absolute top-0 left-0 z-10  w-full ">
              <TopNav />
            </div>
            <div 
             style={{
              top: actualTopNavbarHeight
            }}
            className="absolute top-0 left-0 z-0 h-full ">
              <SideNav />
            </div>
          </div>
          <div className="lg:hidden block p-5 h-screen">
            <div className="flex justify-center h-full">
              <div className="flex flex-col text-center justify-center h-full">
                <div className="text-sm">DigitDove Locked 🔒</div>
                <div className="text-2xl">Your Screen Size Is Too Small 💻</div>
                <div className="text-base">
                  DigitDove only works on laptop and desktop screens (display
                  sizes 1024px and above).
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      ) : (
        <div>
          you are not logged in
          <div className="relative z-10">{children}</div>
        </div>
      )}
    </>
  );
};

export default ClientLayout;
