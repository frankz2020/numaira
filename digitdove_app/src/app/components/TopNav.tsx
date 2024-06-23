import React, { useState } from "react";
import SearchBar from "./Searchbar";
import NavButton, { HighlightDirection } from "./NavButton";
import HomeSVG from "../assets/home.svg";
import BrowseSVG from "../assets/browse.svg";
import CreateSVG from "../assets/create.svg";
import TemplateSVG from "../assets/template.svg";
import CommunitySVG from "../assets/community.svg";
import SettingSVG from "../assets/setting.svg";
import BellSVG from "../assets/bell.svg";
import HelpSVG from "../assets/helpMessage.svg";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "../providers/ThemeContext";
import { useFormat } from "../providers/FormatContext";
import { ButtonOptions } from "./SideNav";
const TopNav = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { format } = useFormat();
  const [selectedBtn, setSelectedBtn] = useState(ButtonOptions.Home);
  const pathname = usePathname();
  return (
    // <div className="h-100">
      <div
        className="relative flex justify-between items-center border-b-2"
        style={{
          borderColor: theme.neutual200,
          backgroundColor: theme.neutral100,
          height:  (parseFloat(format.topNavbarHeight) / 100) * window.innerHeight,
          minHeight: format.minTopNavbarHeight,
          maxHeight: format.maxTopNavbarHeight,
        }}
      >
        <div className="flex justify-between items-center w-full h-100 p-2">
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
    // </div>
  );
};

export default TopNav;
