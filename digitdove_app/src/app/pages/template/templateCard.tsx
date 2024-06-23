"use client";
import React from "react";
import styled from "styled-components";
import { useTheme } from "@/app/providers/ThemeContext";
import { useFormat } from "@/app/providers/FormatContext";
import MoreSVG from "../../assets/moreVertical.svg";
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
    width: 15%;
    max-width: 230px;
    min-width: 250px;
    background-color: ${({ theme }) => `${theme.neutual100}`};
    border-radius: ${({ format }) => format.roundmd};
    padding: 8px;
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
    <CardContainer
      theme={theme}
      format={format}
      style={{ backgroundColor: theme.neutral200 }}
    >
      {image != undefined ? (
        <CardImage src={image} alt={title} />
      ) : (
        <CardImage src="https://via.placeholder.com/200" alt={title} />
      )}

    <div className="flex justify-between mt-2 align-center">
    <CardTitle>{title}</CardTitle>
      <MoreSVG/>
    </div>
     
      <CardDescription>{description}</CardDescription>
    </CardContainer>
  );
};

export default TemplateCard;
