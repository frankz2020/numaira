"use client";
import React, { useState } from "react";
import NavButton, { HighlightDirection } from "./NavButton";
import { useTheme } from "../providers/ThemeContext";
import { useFormat } from "../providers/FormatContext";
import HomeSVG from "../assets/home.svg";
import BrowseSVG from "../assets/browse.svg";
import CreateSVG from "../assets/create.svg";
import TemplateSVG from "../assets/template.svg";
import CommunitySVG from "../assets/community.svg";
import SettingSVG from "../assets/setting.svg";
import BellSVG from "../assets/bell.svg";
import HelpSVG from "../assets/helpMessage.svg";
import SearchBar from "./Searchbar";
import { useRouter } from "next/navigation";
enum ButtonOptions {
  Home,
  Create,
  Browse,
  Template,
  Community,
  Help,
  Bell,
  Setting,
}
const Navbar = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { format } = useFormat();
  const [selectedBtn, setSelectedBtn] = useState(ButtonOptions.Home);
  return (
    <>
      {/* Top Navbar */}
      <div
        className="w-full flex justify-between items-center p-2 border-b-2"
        style={{
          borderColor: theme.neutual200,
          backgroundColor: theme.neutral100,
          height: format.topNavbarHeight,
          minHeight: format.minTopNavbarHeight,
          maxHeight: format.maxTopNavbarHeight,
         
        }}
      >
        <div className="flex justify-between items-center w-full">
          <div
            style={{
              color: theme.primary,
              fontSize: format.textXL,
              fontWeight: "bold",
            }}
            onClick={() => {
              console.log("click");
              router.push("/");
            }}
            className="cursor-pointer p-2"
          >
            DigitDove
          </div>
          <SearchBar />
          <div className="flex justify-between gap-4 items-center">
            <NavButton
              highlightDirection={HighlightDirection.Left}
              selected={selectedBtn == ButtonOptions.Bell}
              onClick={() => setSelectedBtn(ButtonOptions.Bell)}
              SvgIcon={BellSVG}
            />
            <NavButton
              highlightDirection={HighlightDirection.Left}
              selected={selectedBtn == ButtonOptions.Help}
              onClick={() => setSelectedBtn(ButtonOptions.Help)}
              SvgIcon={HelpSVG}
            />
            <NavButton
              highlightDirection={HighlightDirection.Left}
              selected={selectedBtn == ButtonOptions.Setting}
              onClick={() => setSelectedBtn(ButtonOptions.Setting)}
              SvgIcon={SettingSVG}
            />
            <div>Avatar</div>
          </div>
        </div>
      </div>

      {/* Side Navbar */}
      <div
        className="flex flex-col p-1 h-full gap-4 border-r-2"
        style={{
          borderColor: theme.neutual200,
          backgroundColor: theme.neutral100,
          width: format.sideNavbarWidth,
          maxWidth: format.maxSideNavbarWidth,
          minWidth: format.minSideNavbarWidth,
          height: `calc(100vh - ${format.topNavbarHeight})`,
        }}
      >
        <NavButton
          name="Home"
          highlightDirection={HighlightDirection.Left}
          selected={selectedBtn == ButtonOptions.Home}
          onClick={() => {
            setSelectedBtn(ButtonOptions.Home);
            router.push("/home");
          }}
          SvgIcon={HomeSVG}
        />
        <NavButton
          name="Create"
          highlightDirection={HighlightDirection.Left}
          selected={selectedBtn == ButtonOptions.Create}
          onClick={() => {
            setSelectedBtn(ButtonOptions.Create);
            router.push("/create");
          }}
          SvgIcon={CreateSVG}
        />
        <NavButton
          name="Browse"
          highlightDirection={HighlightDirection.Left}
          selected={selectedBtn == ButtonOptions.Browse}
          onClick={() => {
            setSelectedBtn(ButtonOptions.Browse);
            router.push("/browse");
          }}
          SvgIcon={BrowseSVG}
        />
        <NavButton
          name="Template"
          highlightDirection={HighlightDirection.Left}
          selected={selectedBtn == ButtonOptions.Template}
          onClick={() => {
            setSelectedBtn(ButtonOptions.Template);
            router.push("/template");
          }}
          SvgIcon={TemplateSVG}
        />
        <NavButton
          name="Community"
          highlightDirection={HighlightDirection.Left}
          selected={selectedBtn == ButtonOptions.Community}
          onClick={() => {
            setSelectedBtn(ButtonOptions.Community);
            router.push("/community");
          }}
          SvgIcon={CommunitySVG}
        />
      </div>
    </>
  );
};

export default Navbar;
