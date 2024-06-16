"use client";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { useFormat } from "../providers/FormatContext";
import { useGlobalContext } from "../providers/GlobalContext";
import { useRouter } from "next/navigation";
const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { format } = useFormat();
  const { loggedIn } = useGlobalContext();
  const router = useRouter();
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
            {/* Top Navbar */}
            <div className="absolute top-0 left-0 z-0 h-full w-full ">
              <Navbar />
            </div>

            {/* Main Content */}
            <div
              className="relative z-10"
              style={{
                left: format.sideNavbarWidth,
                top: format.topNavbarHeight,
                height: `calc(100vh - ${format.topNavbarHeight})`,
                width: `calc(100vw - ${format.sideNavbarWidth})`,
              }}
            >
              {children}
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
          <div
            className="relative z-10"
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default ClientLayout;
