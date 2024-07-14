"use client";
import React from "react";
import styled from "styled-components";
import { useTheme } from "@/app/providers/ThemeContext";
import { useFormat } from "@/app/providers/FormatContext";
import MoreSVG from "../../assets/moreVertical.svg";
import NumairaFrame from "../../assets/placeholder/numairaFrame.svg";
interface TemplateCardProps {
  image?: string;
  title: string;
  description: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  image,
  title,
  description,
}) => {
  const CardContainer = styled.div`
    min-width: 230px;
    height: 250px;
    align-items: center;
    border-radius: ${(props) => props.format.roundmd};
    background-color: ${(props) => props.theme.neutral100} !important;
  `;

  const CardImage = styled.img`
    width: 100%;
    height: auto;
    border-radius: 8px;
  `;

  const CardTitle = styled.h2`
    font-size: 18px;
    font-weight: bold;
  `;

  const CardDescription = styled.p`
    margin-top: 8px;
    font-size: 14px;
  `;

  const { theme } = useTheme();
  const { format } = useFormat();
  return (
    <CardContainer theme={theme} format={format}>
      <div className="p-2" style={{ backgroundColor: theme.neutral300 }}>
        <div>
          <NumairaFrame />
        </div>

        <div
          style={{ backgroundColor: theme.neutral100 }}
          className={"p-4 flex justify-between"}
        >
          <div className="item-center">{title}</div>
          <div>
            <MoreSVG />
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default TemplateCard;
