"use client";
import React, { useEffect, useState } from "react";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import DocxViewer from "./DocxViewer"; // Import the new DocxViewer component
import DocxXMLEditor from "@/app/DocxXMLEditor/DocxXMLEditor";
import { useGlobalContext } from "@/app/providers/GlobalContext";
import { useTheme } from "@/app/providers/ThemeContext";
import { useFormat } from "@/app/providers/FormatContext";
import {
  StyledPrimaryButton,
  StyledSecondaryButton,
} from "@/app/components/generalStyleComponents";
import ThemeTintedText from "@/app/components/themeTintedText";
import { PrimaryButton } from "@react-pdf-viewer/core";

const Review = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  const { syncSpaceTargetFile, setSyncSpaceTargetFile } = useGlobalContext();
  const [docContent, setDocContent] = useState<ArrayBuffer | null>(null);
  const [preview, setPreview] = useState<boolean>(false);
  const [compareView, setCompareView] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const { theme } = useTheme();
  const { format } = useFormat();

  // set a current time for file
  useEffect(() => {
    const now = new Date(); // Get current date and time
    const formattedTime = now.toLocaleString("en-US", {
      month: "short", // Abbreviated month (e.g., Jan, Feb)
      day: "numeric", // Day of the month
      year: "numeric", // Full year
      hour: "numeric", // Hour in 12-hour format
      minute: "numeric", // Minute
      second: "numeric", // Second
      hour12: true, // 12-hour format with AM/PM
    });

    setCurrentTime(formattedTime); // Set the formatted time in the state
  }, []);

  useEffect(() => {
    if (syncSpaceTargetFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        setDocContent(arrayBuffer);
      };
      reader.readAsArrayBuffer(syncSpaceTargetFile);
    }
  }, [syncSpaceTargetFile]);

  const downloadUpdatedDocx = () => {
    if (!docContent) return;
    const updatedBlob = new Blob([docContent], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    saveAs(updatedBlob, "updated_document.docx");
  };

  return (
    <div className="flex flex-col w-full h-full overflow-scroll">
      <div
        style={{
          height: "90px",
          paddingLeft: "2em",
          paddingRight: "2em",
          paddingBottom: "1em",
          paddingTop: "1em",
        }}
      >
        {compareView ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="p-4 cursor-pointer flex items-center justify-center" // Ensure vertical & horizontal centering
                style={{
                  backgroundColor: theme.neutral50,
                  borderRadius: format.roundmd,
                }}
                onClick={() => setCompareView(false)}
              >
                Back
              </div>
              <div className="flex items-center">
                {/* Ensures vertical alignment */}
                <div style={{ fontSize: format.displaySM }}>
                  Uploaded Files : Generated File
                </div>
              </div>
            </div>
            {saved ? (
              <div
                style={{
                  backgroundColor: theme.neutral700,
                  color: theme.neutral,
                  borderRadius: format.roundmd,
                  padding: "0.5em 1em",
                }}
                className="cursor-pointer"
              >
                Saved
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: theme.brand500,
                  color: theme.neutral,
                  borderRadius: format.roundmd,
                  padding: "0.5em 1em",
                }}
                className="cursor-pointer"
                onClick={() => setSaved(true)}
              >
                Save
              </div>
            )}
          </div>
        ) : (
          <div className="items-center flex justify-between">
            <div className="flex gap-4">
              <div
                className="p-4 cursor-pointer"
                style={{
                  backgroundColor: theme.neutral50,
                  borderRadius: format.roundmd,
                }}
              >
                Back
              </div>
              <div>
                <div style={{ fontSize: format.displaySM }}>Generated File</div>
                <div className="flex">
                  <div style={{ fontSize: format.textXS }} className="pe-3">
                    Generated on:
                  </div>
                  <div
                    style={{ fontSize: format.textXS, color: theme.neutral700 }}
                  >
                    {currentTime}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex gap-4">
                <StyledSecondaryButton onClick={() => setCompareView(true)}>
                  Compare Document
                </StyledSecondaryButton>
                <StyledPrimaryButton  onClick={downloadUpdatedDocx}>Export as DOCX</StyledPrimaryButton>
              </div>
              <div className="flex justify-end mt-2">
                <input type="checkbox" className="me-2" />
                <label
                  style={{ fontSize: format.textXS, color: theme.neutral700 }}
                >
                  Highlight Changes
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        {compareView ? (
          <div className="flex gap-4">
            <div style={{ backgroundColor: theme.neutral50 }}>
              <CompareViewHeader fileName="targetFile" />
              <DocxViewer
                file={syncSpaceTargetFile}
                setFile={setSyncSpaceTargetFile}
                allowEdit={true}
              />
            </div>
            <div style={{ backgroundColor: theme.neutral50 }}>
              <CompareViewHeader fileName="generatedFile" />
              <DocxViewer
                file={syncSpaceTargetFile}
                setFile={setSyncSpaceTargetFile}
                allowEdit={true}
              />
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: theme.neutral50 }}>
            <DocxViewer
              file={syncSpaceTargetFile}
              setFile={setSyncSpaceTargetFile}
              allowEdit={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const CompareViewHeader = ({ fileName }: { fileName: string }) => {
  const { theme } = useTheme();
  return (
    <div
      className="items-center flex justify-between px-5 py-2"
      style={{
        backgroundColor: theme.neutral,
        border: "1px solid " + theme.neutral200,
      }}
    >
      <div className="flex gap-1 items-center">
        {/* Add items-center to vertically center */}
        <div>{fileName}</div>
        <ThemeTintedText text={".docx"} themeColor={theme.docx_color} />
      </div>
    </div>
  );
};
export default Review;
