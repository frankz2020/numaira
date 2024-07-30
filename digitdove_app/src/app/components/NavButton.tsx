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
  SvgIconSelected?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  useStroke?: boolean;
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
  min-width: 60px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 100%;
  padding: 5px;
`;

const NavButton: React.FC<NavButtonProps> = ({
  name,
  highlightDirection,
  selected,
  onClick,
  SvgIcon,
  SvgIconSelected,
  useStroke
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
      {SvgIcon && SvgIconSelected && (
        <div>
          {selected ? (
            <SvgIconSelected />
          ) : (
            <SvgIcon stroke={useStroke ? theme.neutral1000 : ''} strokeWidth={2} />
          )}
        </div>
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
