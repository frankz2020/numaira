"use client";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import Quill from "quill";
import { useGlobalContext } from "@/app/providers/GlobalContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import TemplateType from "../templateType";
type ViewTemplateProps = {};

const ViewTemplate = (props: ViewTemplateProps) => {
  const { backendUrl } = useGlobalContext();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id");
  const [template, setTemplate] = useState<TemplateType | null>(null);
  const handleOpenTemplate = async () => {
    console.log("open tempalte");
    try {
      const response = await fetch(
        `${backendUrl}/template/getTemplate/${templateId}`,
        {
          credentials: "include",
          method: "GET",
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch template");
      }
      const data = await response.json();
      setTemplate(data);
      console.log("template:", data);
    } catch (error) {
      console.log("Error fetching template:", error);
    }
  };

  useEffect(() => {
    handleOpenTemplate();
  }, []);

  return (
    <div>
      {template === null ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>{template.name}</div>
          <p>Last edited: {template.last_edited}</p>

          {template.paragraphs.map((paragraph: string, index: number) => {
            const delta = JSON.parse(paragraph);
            return (
              <ReactQuill
                key={index}
                value={delta}
                readOnly={true}
                theme="bubble" // Use a theme that doesn't show the toolbar
                modules={{ toolbar: false }} // Disable the toolbar
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default ViewTemplate;
