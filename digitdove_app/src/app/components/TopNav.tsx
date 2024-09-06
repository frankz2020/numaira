import React, { useEffect, useState } from "react";
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
import styled from "styled-components";
import { useGlobalContext } from "../providers/GlobalContext";
import LogoSVG from "../assets/logo.svg";
const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  margin-right: 10px;
  cursor: pointer;
`;

const TopNav = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { format } = useFormat();
  const { backendUrl, setLoggedIn, loggedIn } = useGlobalContext();
  const [selectedBtn, setSelectedBtn] = useState(ButtonOptions.Home);
  const pathname = usePathname();

  useEffect(() => {
    if (!loggedIn) {
      router.push("/auth");
    }
  }, [loggedIn]);
  return (
    // <div className="h-100">
    <div
      className="relative flex justify-between items-center border-b-2"
      style={{
        borderColor: theme.neutual200,
        backgroundColor: theme.neutral100,
        height: (parseFloat(format.topNavbarHeight) / 100) * window.innerHeight,
        minHeight: format.minTopNavbarHeight,
        maxHeight: format.maxTopNavbarHeight,
      }}
    >
      <div className="flex justify-between items-center w-full h-100 p-2">
        <div
          onClick={() => {
            console.log("click");
            router.push("/");
          }}
          className="cursor-pointer p-2 w-14 h-14"
        >
          <LogoSVG fill={theme.brand500}/>
        </div>
        
        <SearchBar />
        <div className="flex justify-between gap-4 items-center">
          <NavButton
            highlightDirection={HighlightDirection.Left}
            selected={selectedBtn == ButtonOptions.Bell}
            onClick={() => setSelectedBtn(ButtonOptions.Bell)}
            SvgIcon={BellSVG}
            SvgIconSelected={BellSVG}
            useStroke={true}
          />
          <NavButton
            highlightDirection={HighlightDirection.Left}
            selected={selectedBtn == ButtonOptions.Help}
            onClick={() => setSelectedBtn(ButtonOptions.Help)}
            SvgIcon={HelpSVG}
            SvgIconSelected={HelpSVG}
            useStroke={true}
          />
          <NavButton
            highlightDirection={HighlightDirection.Left}
            selected={selectedBtn == ButtonOptions.Setting}
            onClick={() => setSelectedBtn(ButtonOptions.Setting)}
            SvgIcon={SettingSVG}
            SvgIconSelected={SettingSVG}
            useStroke={true}
          />
          <AvatarContainer>
            <Avatar
              theme={theme}
              onClick={async () => {
                try {
                  const response = await fetch(backendUrl + "/user/logout", {
                    method: "GET",
                    credentials: "include",
                  });

                  if (!response.ok) {
                    throw new Error("Error logging out, check your internet");
                  }

                  const data = await response.json();
                  console.log("data:", data);
                  setLoggedIn(false);
                  router.push("/home");

                  const aliveResponse = await fetch(
                    backendUrl + "/user/current_user",
                    {
                      method: "GET",
                      credentials: "include",
                    }
                  );

                  aliveResponse.json().then((data: any) => {
                    console.log("alive:", data);
                  });
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              A
            </Avatar>{" "}
            {/* Replace 'A' with the desired initial or image */}
          </AvatarContainer>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default TopNav;
