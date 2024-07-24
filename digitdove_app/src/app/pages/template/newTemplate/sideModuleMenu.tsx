// SideMenu.tsx
import React from "react";

import styled from "styled-components";
import DraggableButton, { ElementType } from "./draggableButton";
import { useFormat } from "@/app/providers/FormatContext";
import ModuleSVG from "@/app/assets/template/module.svg";
import { useTheme } from "@/app/providers/ThemeContext";
interface SideModuleMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}
const SideModuleMenu: React.FC<SideModuleMenuProps> = ({
  isOpen,
  toggleMenu,
}) => {
  const { format } = useFormat();
  const { theme } = useTheme();
  return (
    <StyledSideMenu isOpen={isOpen} format={format} theme={theme}>
      <div className="flex justify-between">
        <div className="flex border rounded gap-2">
          <ModuleSVG />
          Module
        </div>

        <button onClick={toggleMenu} className="toggle-button">
          X
        </button>
      </div>

      <DraggableButton type={ElementType.DIVIDER} />
      <DraggableButton type={ElementType.TEXT} />
    </StyledSideMenu>
  );
};

const StyledSideMenu = styled.div<{
  isOpen: boolean;
  format: any;
  theme: any;
}>`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 20%;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transform: translateX(${(props) => (props.isOpen ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;
  border-left: ${(props) => " 2px solid " + props.theme.neutral200};
  z-index: 5;
  .toggle-button {
    align-self: flex-start;
    margin-bottom: 20px;
  }
`;

export default SideModuleMenu;
