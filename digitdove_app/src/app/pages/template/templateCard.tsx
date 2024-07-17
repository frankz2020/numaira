"use client";
import React from "react";
import styled from "styled-components";
import { useTheme } from "@/app/providers/ThemeContext";
import { useFormat } from "@/app/providers/FormatContext";
import MoreSVG from "../../assets/moreVertical.svg";
import NumairaFrame from "../../assets/placeholder/numairaFrame.svg";
import { useGlobalContext } from "@/app/providers/GlobalContext";
import { useRouter, useParams } from "next/navigation";

interface TemplateCardProps {
  templateId: string;
  title: string;
  description?: string;
  lastEdited?: string;
}

// Moved styled components outside of TemplateCard to avoid recreation on every render
const CardContainer = styled.div<{ theme: any; format: any }>`
  min-width: 230px;
  min-height: 250px;
  align-items: center;
  border-radius: ${(props) => props.format.roundmd};
  background-color: ${(props) => props.theme.neutral100} !important;
  cursor: pointer;
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

const TemplateCard: React.FC<TemplateCardProps> = ({
  templateId,
  title,
  description,
  lastEdited,
}) => {
  const { theme } = useTheme();
  const { format } = useFormat();
  const router = useRouter();
  const {backendUrl} = useGlobalContext()
  return (
    <CardContainer theme={theme} format={format} onClick={() => {router.push(`/template/viewTemplate?id=${templateId}`)} }>
      <div className="p-2" style={{ backgroundColor: theme.neutral300 }}>
        <div>
          <NumairaFrame />
        </div>

        <div
          style={{ backgroundColor: theme.neutral100 }}
          className="py-1 px-2"
        >
          <div  className={"flex justify-between"}>
            <div className="item-center">{title}</div>
            <div>
              <MoreSVG />
            </div>
          </div>

          <div className="pt-1 text-sm" style={{color: theme.neutral700}} >Last Modified: {lastEdited ?? "unknown"}</div>
        </div>
      </div>
    </CardContainer>
  );
};

export default TemplateCard;
