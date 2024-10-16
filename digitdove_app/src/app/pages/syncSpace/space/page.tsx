"use client";
import React, { use, useEffect, useState } from "react";
import { useTheme } from "@/app/providers/ThemeContext";
import { useFormat } from "@/app/providers/FormatContext";
import StepHeader from "@/app/components/StepHeader";
import UploadButton from "../uploadButton";
import styled, { css, keyframes } from "styled-components";
import PDFimage from "../../../assets/placeholder/pdfFrame.svg";
import XLSXimage from "../../../assets/placeholder/xlsxFrame.svg";
import DOCXimage from "../../../assets/placeholder/docxFrame.svg";
import UploadSVG from "../asset/upload.svg";
import UpdataSVG from "../asset/updata.svg";
import ArrowSVG from "../asset/arrow.svg";
import QuestionSVG from "../../../assets/question.svg";
import mammoth from "mammoth";
import { read as XLSXRead, utils as XLSXUtil } from "xlsx";
import { useGlobalContext } from "@/app/providers/GlobalContext";
import SyncSpaceSVG from "../../../assets/syncSpace.svg";
import { Document, Packer, Paragraph, TextRun, WidthType } from "docx";
import assert from "assert";
import { saveAs } from "file-saver";

import DocumentSVG from "../asset/documentSVG.svg";
import LogoSVG from "../../../assets/logo.svg";
import { useRouter } from "next/navigation";
import {
  VerticalArrow,
  HorizontalArrow,
  FileVisualDiv,
  FileDisplayContainer,
} from "../styled";
import ProgressBar from "@/app/components/progressBar";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { readDocxFile } from "../utils";
import SpreadSheetRel from "./spreadSheetRel";
import UploadCard from "../uploadCard";
import SourceSelection from "./sourceSelection";
enum SyncSpaceStep {
  syncSpaceTargetFile,
  AssociatedData,
  NewData,
  Generate,
  ReviewExport,
}

const LoadingNumariaVisualDiv = styled.div`
  max-width: 280px;
  min-width: 200px;
  width: 25%;
  height: auto;
  min-height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: ${(props) => props.theme.neutral100} !important;
`;

const pulse = (color: string) => keyframes`
0% {
  transform: scale(0.95);
  box-shadow: 0 0 0 0 ${color};
}
70% {
  transform: scale(1);
  box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
}
100% {
  transform: scale(0.95);
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
}
`;

// Styled component using the dynamic keyframes
const GenerateButton = styled.div<{ theme: any; format: any }>`
  background: ${(props) => props.theme.brand500};
  border-radius: ${(props) => props.format.roundmd};
  margin: 10px;
  box-shadow: ${(props) => "0 0 0 0 " + props.theme.brand500};
  transform: scale(1);
  animation: ${(props) =>
    css`
      ${pulse(props.theme.brand500)} 2s infinite
    `};
  cursor: pointer;
  color: ${(props) => props.theme.neutral};
`;

const VisualPlaceholder = ({ text }: { text: string }) => {
  const { theme } = useTheme();
  return (
    <div
      className="flex items-center justify-center"
      style={{
        maxWidth: " 280px",
        minWidth: "200px",
        width: "25%",
        height: "auto",
        minHeight: "240px",
        alignItems: "center",
        borderRadius: "8px",
        border: "2px dotted " + theme.neutral1000,
      }}
    >
      <div className="flex flex-col items-center">
        <DocumentSVG />
        {text}
      </div>
    </div>
  );
};

const getPlaceHolder = (name: string) => {
  if (name.split(".").pop() === "pdf") {
    return <PDFimage />;
  }
  if (name.split(".").pop() === "docx") {
    return <DOCXimage />;
  }
  if (name.split(".").pop() === "xlsx") {
    return <XLSXimage />;
  }
};

const Arrow: React.FC<{ direction: string; theme: any }> = ({
  direction,
  theme,
}) => {
  if (direction === "up" || direction === "down") {
    return <VerticalArrow direction={direction} theme={theme} />;
  } else {
    return <HorizontalArrow direction={direction} theme={theme} />;
  }
};

const readExcelFile = (file: File, numberOnly: boolean): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const workbook = XLSXRead(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSXUtil.sheet_to_json(worksheet, { header: 1 });

      // Flatten the array and filter based on numberOnly
      const flatArray = jsonData
        .flat()
        .filter((value: any) => typeof value === "number")
        .map((value: number) => value.toString());

      resolve(flatArray);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Define the slide-up keyframes animation
const slideUp = keyframes`
  from {
    transform: translateY(100%); /* Start from the bottom */
    opacity: 0; /* Hidden */
  }
  to {
    transform: translateY(0); /* Move to the top */
    opacity: 1; /* Fully visible */
  }
`;

// Create the styled div for the absolute container
const AbsoluteContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(
    0,
    0,
    0,
    0.5
  ); /* Optional: Semi-transparent background */
  z-index: 9999; /* Ensure it's on top */

  &.show {
    animation: ${slideUp} 0.5s ease-in-out forwards; /* Apply slide-up animation */
  }
`;

const Tooltip = styled.div<{ visible: boolean; x: number; y: number }>`
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  text-align: center;
  border-radius: 4px;
  padding: 8px;
  position: fixed;
  z-index: 1000; /* High z-index to ensure it appears above other elements */
  top: ${({ y }) => `${y}px`}; /* Use mouse's Y coordinate */
  left: ${({ x }) => `${x}px`}; /* Use mouse's X coordinate */
  transform: translate(-50%, -100%); /* Adjust position above the cursor */
  white-space: nowrap;
  font-size: 14px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const TooltipWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SyncSpace = () => {
  const { format } = useFormat();
  const { theme } = useTheme();
  const {
    syncSpaceTargetFile,
    setSyncSpaceTargetFile,
    syncSpaceOutputFile,
    setSyncSpaceOutputFile,
  } = useGlobalContext();
  const { backendUrl } = useGlobalContext();
  const [currentStep, setCurrentStep] = useState(
    SyncSpaceStep.syncSpaceTargetFile
  );

  const [targetFileText, setTargetFileText] = useState<string | null>(null);

  const [associatedData, setAssociatedData] = useState<File | null>(null);
  const [associatedDataValue, setAssociatedDataValue] = useState<any[] | null>(
    null
  );

  const [newData, setNewData] = useState<File | null>(null);
  const [newDataValue, setNewDataValue] = useState<any[] | null>(null);

  const [showMapSpreadsheetRel, setShowMapSpreadsheetRel] = useState(false);
  type ErroType = {
    error: boolean;
    name: string;
  };

  const [error, setError] = useState<ErroType>({ error: false, name: "" });
  const [outputFile, setOutputFile] = useState(null);
  enum generationProcessStage {
    Prepare,
    Start,
    Finish,
  }
  const [generationProcess, setGenerationProcess] =
    useState<generationProcessStage>(generationProcessStage.Prepare);

  const router = useRouter();
  // useEffect(() => {
  //   setGenerationProcess(generationProcessStage.Start);
  // }, [error, generationProcessStage.Start]);

  const [generationCompleteBuffer, setGenerationCompleteBuffer] =
    useState(false);

  const [isTargetFileTooltipVisible, setIsTargetFileTooltipVisible] =
    useState(false);
  const [isSourceDataTooltipVisible, setIsSourceDataTooltipVisible] =
    useState(false);

  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    // Update the tooltip position with mouse coordinates
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const [openSourceSelection, setOpenSourceSelection] = useState(false);

  const FileCard = styled.div`
    background-color: ${theme.neutral50};
    border-radius: ${format.roundmd};
    border-color: ${theme.neutral100};
    border-width: 2px;
    padding: 1rem;
    margin: 1rem;
    width: 310px;
    min-height: 240px;
  `;

  const FileHolder = styled.div`
    background-color: ${theme.neutral};
    border-radius: ${format.roundmd};
    border-color: ${theme.neutral100};
    border-width: 2px;
    padding: 1rem;
    width: 90%;
    min-height: 140px;
  `;

  const sendToBackend = async () => {
    try {
      const response = await fetch(backendUrl + "/ai/mapExcelNumberToWord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          oldExcelValue: associatedDataValue,
          newExcelValue: newDataValue,
          wordValue: targetFileText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to backend");
      }
      const results = await response.json(); // Await the JSON parsing
      console.log("Data sent to backend successfully");
      console.log("Results:", results); // Log the returned data
      replaceTextInDocx(results.results);
    } catch (error) {
      setError({ error: true, name: "Network Error" });
      console.error("Error sending data to backend:", error);
    }
  };

  const replaceTextInDocx = async (replacements: string[][]) => {
    let output: any = null;
    let file = syncSpaceTargetFile;
    assert(file != null);
    if (!replacements || replacements.length === 0) {
      console.error("The replacements array is empty.");
      return;
    }

    const arrayBuffer = await file.arrayBuffer();

    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const flatReplacements = replacements.flat();
    console.log("Flat replacements:", flatReplacements);

    // Remove null values from flatReplacements
    const filteredReplacements: any = [];
    flatReplacements.map((valuePair) => {
      if (valuePair != null) {
        filteredReplacements.push(valuePair);
      }
    });

    // Create a new document with the updated text
    filteredReplacements.forEach(([previousValue, newValue]: [any, any]) => {
      doc.setData({ [previousValue]: newValue });
    });

    try {
      doc.render();
    } catch (error) {
      console.error("Error rendering document:", error);
      throw error;
    }

    output = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    setOutputFile(output);
    setSyncSpaceOutputFile(output);
  };

  const uploadTargetFile = async (file: File) => {
    try {
      const { text, html, arrayBuffer } = await readDocxFile(file);
      setTargetFileText(text);
      setSyncSpaceTargetFile(file);
    } catch (error) {
      console.error("Error reading .docx file:", error);
    }
  };

    const uploadDataSource = async (file: File) => {
    console.log("associatedData", file);
    setAssociatedData(file);
    try {
      const data = await readExcelFile(file, true);
      setAssociatedDataValue(data);
      console.log("Extracted data:", data);
    } catch (error) {
      console.error("Error reading .xlsx file:", error);
    }
  };

  useEffect(() => {
    if (currentStep === SyncSpaceStep.ReviewExport) {
      console.log("go to review");
      router.push("/syncSpace/review");
    }
  }, [currentStep]);

  const donwloadUpdatedDocx = () => {
    assert(outputFile != null);
    saveAs(outputFile, "updated_document.docx");
  };

  useEffect(() => {
    if (currentStep === SyncSpaceStep.NewData) {
      setShowMapSpreadsheetRel(true);
    }
  }, [currentStep]);

  return (
    <div className="flex flex-row-reverse h-100" style={{ height: "100%" }}>
      <div
        className="h-100 hidden"
        style={{ width: "30%", backgroundColor: theme.neutral50 }}
      >
        <div className="p-3">
          <div className="flex justify-between">
            <div style={{ fontSize: format.displaySM, fontWeight: 400 }}>
              SyncSpace
            </div>
            <div
              onClick={() => {
                setCurrentStep(SyncSpaceStep.ReviewExport);
                router.push("/syncSpace/review");
              }}
            >
              go to review
            </div>
            <div
              onClick={() => {
                router.push("/test");
              }}
            >
              excel test
            </div>
            <div style={{ color: theme.brand500, fontSize: format.textXS }}>
              Reset
            </div>
          </div>

          <div className="text-sm " style={{ color: theme.neutral700 }}>
            Upload documents and generate output
          </div>
        </div>
        <div className="mt-2 mx-2">
          <StepHeader
            order={1}
            name="Target File"
            finished={currentStep > SyncSpaceStep.syncSpaceTargetFile}
            atStage={currentStep == SyncSpaceStep.syncSpaceTargetFile}
            information="Upload your documents here"
          />
          {currentStep == SyncSpaceStep.syncSpaceTargetFile && (
            <UploadButton
              fileType={[".docx"]}
              onClick={async (file: File) => {
                try {
                  const { text, html, arrayBuffer } = await readDocxFile(file);
                  setTargetFileText(text);
                  setSyncSpaceTargetFile(file);
                  setCurrentStep(currentStep + 1);
                } catch (error) {
                  console.error("Error reading .docx file:", error);
                }
              }}
            />
          )}
          {syncSpaceTargetFile && (
            <FileDisplayContainer theme={theme}>
              <div className="flex justify-start gap-2 flex-wrap">
                <div>{syncSpaceTargetFile.name}</div>
                <div style={{ color: theme.neutral700 }}>
                  · {(syncSpaceTargetFile.size / 1024).toFixed(2)} KB
                </div>
              </div>
            </FileDisplayContainer>
          )}

          <StepHeader
            order={2}
            name="Associated Data"
            finished={currentStep > SyncSpaceStep.AssociatedData}
            atStage={currentStep == SyncSpaceStep.AssociatedData}
            information="Upload your documents here"
          />
          {currentStep == SyncSpaceStep.AssociatedData && (
            <UploadButton
              fileType={[".xlsx"]}
              onClick={async (file: File) => {
                console.log("associatedData", file);
                setAssociatedData(file);
                setCurrentStep(currentStep + 1);
                try {
                  const data = await readExcelFile(file, true);
                  setAssociatedDataValue(data);
                  console.log("Extracted data:", data);
                } catch (error) {
                  console.error("Error reading .xlsx file:", error);
                }
              }}
            />
          )}
          {associatedData && (
            <FileDisplayContainer theme={theme}>
              <div className="flex justify-start gap-2 flex-wrap">
                <div>{associatedData.name}</div>

                <div style={{ color: theme.neutral700 }}>
                  {" "}
                  · {(associatedData.size / 1024).toFixed(2)} KB
                </div>
              </div>
            </FileDisplayContainer>
          )}

          <StepHeader
            order={3}
            name="New Data"
            finished={currentStep > SyncSpaceStep.NewData}
            atStage={currentStep == SyncSpaceStep.NewData}
            information="Upload your documents here"
          />

          {/* absolute div to show the mapSpreadsheetRel */}
          {showMapSpreadsheetRel && (
            <AbsoluteContainer className={showMapSpreadsheetRel ? "show" : ""}>
              <SpreadSheetRel
                inputExcel={associatedData!}
                onBack={() => {
                  setShowMapSpreadsheetRel(false);
                  console.log("back");
                  setCurrentStep(SyncSpaceStep.NewData);
                }}
              />
            </AbsoluteContainer>
          )}

          {currentStep == SyncSpaceStep.NewData && (
            <UploadButton
              fileType={[".xlsx"]}
              onClick={async (file: File) => {
                setNewData(file);
                setCurrentStep(currentStep + 1);
                try {
                  const data = await readExcelFile(file, true);
                  console.log("Extracted data:", data);
                  setNewDataValue(data);
                } catch (error) {
                  console.error("Error reading .xlsx file:", error);
                }
              }}
            />
          )}
          {newData && (
            <FileDisplayContainer theme={theme}>
              <div className="flex justify-start gap-2 flex-wrap">
                <div>{newData.name}</div>

                <div style={{ color: theme.neutral700 }}>
                  {" "}
                  · {(newData.size / 1024).toFixed(2)} KB
                </div>
              </div>
            </FileDisplayContainer>
          )}

          <StepHeader
            order={4}
            name="Generate"
            finished={currentStep > SyncSpaceStep.Generate}
            atStage={currentStep == SyncSpaceStep.Generate}
            information="Upload your documents here"
          />
          {currentStep == SyncSpaceStep.Generate && (
            <div
              className=" items-center flex flex-col justify-center p-5 "
              style={{
                backgroundColor: theme.neutral,
                border: "2px solid " + theme.brand500,
                borderBottomLeftRadius: format.roundmd,
                borderBottomRightRadius: format.roundmd,
              }}
            >
              <GenerateButton
                format={format}
                theme={theme}
                onClick={async () => {
                  setGenerationProcess(generationProcessStage.Start);
                  await sendToBackend();
                  setGenerationCompleteBuffer(true);

                  // wait a bit here so the animation finishes
                  await new Promise((resolve) => setTimeout(resolve, 3000));

                  setCurrentStep(currentStep + 1);
                  setGenerationProcess(generationProcessStage.Finish);
                }}
                className="px-3 py-2 m-4 flex gap-1"
              >
                <SyncSpaceSVG width={25} height={25} fill={theme.neutral} />
                {generationProcess == generationProcessStage.Start
                  ? "Generating..."
                  : "Generate"}
              </GenerateButton>
            </div>
          )}
        </div>
      </div>

      <div
        className="flex flex-col justify-center"
        style={{ width: "100%", height: "100%" }}
      >
        {error.error && (
          <div
            className="flex w-full p-3"
            style={{
              border: "2px solid " + theme.warning,
              color: theme.warning,
              backgroundColor: theme.warning_background,
            }}
          >
            <div style={{ fontWeight: 700, marginRight: "2px" }}>
              {error.name}{" "}
            </div>
            <div>The operation could not be completed.</div>
            <div className="underline ms-5 cursor-pointer">Retry</div>
          </div>
        )}

        <div className="flex justify-center">
          <FileCard className="flex flex-col align-center justify-center">
            <div className="flex justify-center mb-3">
              <div
                style={{
                  fontSize: format.textMD,
                  fontWeight: 500,
                }}
              >
                Target File
              </div>
              <TooltipWrapper
                onMouseEnter={(e: React.MouseEvent) => {
                  setIsTargetFileTooltipVisible(true);
                  handleMouseMove(e);
                }}
                onMouseLeave={() => setIsTargetFileTooltipVisible(false)}
              >
                <QuestionSVG />
                <Tooltip
                  visible={isTargetFileTooltipVisible}
                  x={tooltipPos.x}
                  y={tooltipPos.y}
                >
                  This explains the data sources used in the application.
                </Tooltip>
              </TooltipWrapper>
            </div>
            <div className="flex justify-center" style={{ width: "100%" }}>
              <FileHolder>
                <div>
                  {!targetFileText ? (
                    <UploadCard
                      onClick={(file: File) => uploadTargetFile(file)}
                      name="Select File"
                      svgType={"target"}
                      fileType={[".docx"]}
                    />
                  ) : (
                    <div
                      style={{
                        borderRadius: format.roundsm,
                        borderColor: theme.brand100,
                        borderWidth: "1px",
                        padding: "3px",
                      }}
                    >
                      {getPlaceHolder(syncSpaceTargetFile.name)}
                      <div className="flex justify-center mt-3 flex-wrap">
                        <div>{syncSpaceTargetFile.name}</div>
                        <div
                          style={{
                            wordBreak: "break-all", // This will break the text to fit within the available space
                            maxWidth: "200px", // Optional: set a max width for the filename display
                          }}
                        >
                          {/* Hidden file input */}
                          <input
                            type="file"
                            id="fileInput"
                            accept=".docx"
                            style={{ display: "none" }} // Hide the file input
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const file = event.target.files?.[0]; // Get the selected file
                              if (file) {
                                uploadTargetFile(file); // Call the upload function with the new file
                              }
                            }}
                          />

                          {/* Label as the button that triggers the file input */}
                          <label
                            htmlFor="fileInput" // Ties the label to the hidden file input
                            style={{
                              cursor: "pointer", // Make it clear this is clickable
                              color: theme.brand500, // Optional: Add some styling for the reupload button
                              textDecoration: "underline", // Optional: Add underline for link effect
                            }}
                          >
                            Reupload
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </FileHolder>
            </div>
            <div
              style={{
                width: "100%",
                fontSize: format.textSM,
                color: theme.neutral700,
              }}
              className="flex justify-center"
            >
              DOCX Format, up to 10MB
            </div>
          </FileCard>

          <div
            style={{ height: "100%" }}
            className="flex flex-col justify-center"
          >
            <ArrowSVG />
          </div>

          <FileCard className="flex flex-col align-center justify-center">
            <div className="flex justify-center mb-3">
              <div
                style={{
                  fontSize: format.textMD,
                  fontWeight: 500,
                }}
              >
                Data Source(s)
              </div>
              <TooltipWrapper
                onMouseEnter={(e: React.MouseEvent) => {
                  setIsSourceDataTooltipVisible(true);
                  handleMouseMove(e);
                }}
                onMouseLeave={() => setIsSourceDataTooltipVisible(false)}
              >
                <QuestionSVG />
                <Tooltip
                  visible={isSourceDataTooltipVisible}
                  x={tooltipPos.x}
                  y={tooltipPos.y}
                >
                  This explains the data sources used in the application.
                </Tooltip>
              </TooltipWrapper>
            </div>

            <div className="flex justify-center" style={{ width: "100%" }}>
              <FileHolder>
                <div>
                  <UploadCard
                    functional={false}
                    noneUploadClick={() => {
                      setOpenSourceSelection(true);
                    }}
                    name="Add Data"
                    svgType={"data"}
                    fileType={[".xlsx"]}
                  />
                </div>

                {/* source selection, this is absolute */}
                {openSourceSelection && (
                  <SourceSelection
                    open={openSourceSelection}
                    onClose={() => setOpenSourceSelection(false)}
                    upload={uploadDataSource}
                  />
                )}
              </FileHolder>
            </div>
            <div
              style={{
                width: "100%",
                fontSize: format.textSM,
                color: theme.neutral700,
              }}
              className="flex justify-center"
            >
              XLSX Formats, up to 10MB
            </div>
          </FileCard>
        </div>
      </div>
    </div>
  );
};

export default SyncSpace;
