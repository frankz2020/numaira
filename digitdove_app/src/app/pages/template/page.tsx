"use client";
import React from "react";
import TemplateCard from "./templateCard";
import styled from "styled-components";
import { useTheme } from "@/app/providers/ThemeContext";
import { useFormat } from "@/app/providers/FormatContext";
import { TitleText } from "@/app/components/generalStyleComponents";
import {
  StyledPrimaryButton,
  StyledNeutralButton,
} from "@/app/components/generalStyleComponents";
const Template = () => {
  const { theme } = useTheme();
  const { format } = useFormat();

  return (
    <div>
      <TitleText> Templates</TitleText>
      <div className="flex justify-end gap-3 px-5 ">
        <StyledNeutralButton>Create New</StyledNeutralButton>
        <StyledPrimaryButton>Upload File</StyledPrimaryButton>
      </div>

      <div className="p-3 flex flex-wrap gap-4 justify-start">
        {Array.from({ length: 10 }).map((_, index) => (
          <TemplateCard
            key={index}
            title={`card ${index}`}
            description={"this is a test card"}
          />
        ))}
      </div>
    </div>
  );
};

export default Template;
