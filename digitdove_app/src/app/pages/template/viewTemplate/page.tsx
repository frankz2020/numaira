"use client";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import Quill from "quill";
import { useGlobalContext } from "@/app/providers/GlobalContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import TemplateType from "../templateType";
import DraggableDivider from "../newTemplate/draggableDivider";

type ViewTemplateProps = {};

const ViewTemplate = (props: ViewTemplateProps) => {
  const { backendUrl } = useGlobalContext();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id");
  const [template, setTemplate] = useState<TemplateType | null>(null);
  const router = useRouter()
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
          <button onClick={() => {router.push('/template')}}>Back</button>
          <button onClick={() => {router.push('/template')}}>Edit</button>
          <div className="flex justify-start gap-4">
            <div className="p-3 text-xl bold">{template.name}</div>
            <p className="mt-3 text-sm  ">
              Last edited: {template.last_edited}
            </p>
          </div>

          {template.paragraphs.map((paragraph: string, index: number) => {
            let delta = "";
            let isDelta = false;
            if (paragraph !== "divider") {
              delta = JSON.parse(paragraph);
              isDelta = true;
            }

            return (
              <>
                {isDelta ? (
                  <ReactQuill
                    key={index}
                    value={delta}
                    readOnly={true}
                    theme="bubble" // Use a theme that doesn't show the toolbar
                    modules={{ toolbar: false }} // Disable the toolbar
                  />
                ) : (
                  <>
                    <hr />
                  </>
                )}
              </>
            );
          })}
        </>
      )}
    </div>
  );
};

export default ViewTemplate;
