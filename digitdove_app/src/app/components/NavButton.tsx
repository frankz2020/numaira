import React from "react";
import { useTheme } from "../providers/ThemeContext";
import styled from "styled-components";

export enum HighlightDirection {
  Left,
  Right,
  Bottom,
  Top,
}

interface NavButtonProps {
  name?: string;
  highlightDirection?: HighlightDirection;
  selected: boolean;
  onClick: () => void;
  SvgIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Proper type for SVG component
}

const HighlightBar = styled.div.attrs(({ selected, theme }) => ({
  style: {
    backgroundColor: selected ? theme.primary : "transparent",
  },
}))<{
  highlightDirection: HighlightDirection;
  selected: boolean;
  theme: any;
}>`
  position: absolute;
  transition: all 0.3s ease;
  border-radius: 4px;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
 
  
`;
const NavButtonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 100%;
`;

const NavButton: React.FC<NavButtonProps> = ({
  name,
  highlightDirection,
  selected,
  onClick,
  SvgIcon,
}) => {
  const { theme } = useTheme();

  return (
    <NavButtonContainer onClick={onClick}>
      {name && (
        <HighlightBar
          // highlightDirection={highlightDirection}
          selected={selected}
          theme={theme}
        />
      )}
      {SvgIcon && (
        <SvgIcon
          width={30}
          height={30}
          stroke={selected ? theme.neutral100 : theme.neutral1000}
          fill= {selected ? theme.primary : "none"}
          strokeWidth={2}
          className="transition-all"
        />
      )}
      {name && (
        <div
          className="text-xs font-semibold "
          style={{ color: selected ? theme.primary : theme.neutral1000 }}
        >
          {name}
        </div>
      )}
    </NavButtonContainer>
  );
};

export default NavButton;
