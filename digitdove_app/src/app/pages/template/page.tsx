"use client";
import React, { useEffect, useState } from "react";
import TemplateCard from "./templateCard";
import styled from "styled-components";
import { useTheme } from "@/app/providers/ThemeContext";
import { useFormat } from "@/app/providers/FormatContext";
import { TitleText } from "@/app/components/generalStyleComponents";
import { useRouter, usePathname } from "next/navigation";
import {
  StyledPrimaryButton,
  StyledNeutralButton,
} from "@/app/components/generalStyleComponents";
import { useGlobalContext } from "@/app/providers/GlobalContext";
import TemplateType from "./templateType";

const Template = () => {
  const { theme } = useTheme();
  const { format } = useFormat();
  const router = useRouter();
  const { backendUrl } = useGlobalContext();
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${backendUrl}/template/getTemplates`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }

        const data = await response.json();
        console.log("templates:", data);
        setTemplates(data); // Assuming data is an array of templates
      } catch (error) {
        console.log("Error fetching templates:", error);
      }
    };

    fetchTemplates(); // Call the async function
  }, []);
  return (
    <div>
      <TitleText> Templates</TitleText>
      <div className="flex justify-end gap-3 px-5 ">
        <StyledNeutralButton
          onClick={() => {
            router.push("/template/newTemplate");
          }}
        >
          Create New
        </StyledNeutralButton>
        <StyledPrimaryButton>Upload File</StyledPrimaryButton>
      </div>

      <div className="p-3 flex flex-wrap gap-4 justify-start">
        {templates.map((template, index) => (
          <TemplateCard
            templateId={template.id}
            key={index}
            title={template.name}
            description={template.description}
            lastEdited={template.lastEdited}
          />
        ))}
      </div>
    </div>
  );
};

export default Template;
