"use client";
import React, { use, useEffect, useState } from "react";
import { useTheme } from "@/app/providers/ThemeContext";
import { useFormat } from "@/app/providers/FormatContext";
import StepHeader from "@/app/components/StepHeader";
import UploadButton from "./uploadButton";
import styled, { css, keyframes } from "styled-components";
import PDFimage from "../../assets/placeholder/pdfFrame.svg";
import XLSXimage from "../../assets/placeholder/xlsxFrame.svg";
import DOCXimage from "../../assets/placeholder/docxFrame.svg";
import CloseIcon from "../../assets/close.svg";
import mammoth from "mammoth";
import { read as XLSXRead, utils as XLSXUtil } from "xlsx";
import { useGlobalContext } from "@/app/providers/GlobalContext";
import SyncSpaceSVG from "../../assets/syncSpace.svg";
import { Document, Packer, Paragraph, TextRun, WidthType } from "docx";
import assert from "assert";
import { saveAs } from "file-saver";
import SyncArrowSVG from "./SyncArrow.svg";
import DocumentSVG from "./documentSVG.svg";
import CompleteSVG from "./completeSVG.svg";
import LogoSVG from "../../assets/logo.svg";
import { useRouter } from "next/navigation";
import {
  VerticalArrow,
  HorizontalArrow,
  FileVisualDiv,
  FileDisplayContainer,
} from "./styled";
import ProgressBar from "@/app/components/progressBar";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { readDocxFile } from "./utils";
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

const SyncSpace = () => {
  const { format } = useFormat();
  const { theme } = useTheme();
  const {syncSpaceTargetFile, setSyncSpaceTargetFile, setSyncSpaceTargetHTML} = useGlobalContext();
  const { backendUrl } = useGlobalContext();
  const [currentStep, setCurrentStep] = useState(SyncSpaceStep. syncSpaceTargetFile);


  const [targetFileText, setTargetFileText] = useState<string | null>(null);

  const [associatedData, setAssociatedData] = useState<File | null>(null);
  const [associatedDataValue, setAssociatedDataValue] = useState<any[] | null>(
    null
  );

  const [newData, setNewData] = useState<File | null>(null);
  const [newDataValue, setNewDataValue] = useState<any[] | null>(null);

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
    let file =  syncSpaceTargetFile;
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
  };

  const donwloadUpdatedDocx = () => {
    assert(outputFile != null);
    saveAs(outputFile, "updated_document.docx");
  };

  return (
    <div className="flex flex-row-reverse h-100" style={{ height: "100%" }}>
      <div
        className="h-100"
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
          {currentStep == SyncSpaceStep. syncSpaceTargetFile && (
            <UploadButton
              fileType={[".docx"]}
              onClick={async (file: File) => {
                try {
                  const { text, html, arrayBuffer } = await readDocxFile(file);
                  setTargetFileText(text);
                  
                  setSyncSpaceTargetHTML(html);
                   setSyncSpaceTargetFile(file);
                  setCurrentStep(currentStep + 1);
                } catch (error) {
                  console.error("Error reading .docx file:", error);
                }
              }}
            />
          )}
          { syncSpaceTargetFile && (
            <FileDisplayContainer theme={theme}>
              <div className="flex justify-start gap-2 flex-wrap">
                <div>{ syncSpaceTargetFile.name}</div>
                <div style={{ color: theme.neutral700 }}>
                  · {( syncSpaceTargetFile.size / 1024).toFixed(2)} KB
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

      <div className="flex flex-col" style={{ width: "70%" }}>
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
              {" "}
              {error.name}{" "}
            </div>
            <div>The operation could not be completed.</div>
            <div className="underline ms-5 cursor-pointer">Retry</div>
          </div>
        )}

        <div className="justify-center items-center gap-5 p-10 h-full">
          <div
            className="flex flex-col justify-center p-4 w-100 h-100"
            style={{ width: "100%", height: "100%" }}
          >
            {/* Row 1 */}
            <div className="flex justify-center gap-10 h-100 w-100">
              {/* Row 1.1 */}
              <div className=" flex justify-center items-end  w-40">
                { syncSpaceTargetFile != null && (
                  <FileVisualDiv
                    dotted={true}
                    theme={theme}
                    opacity={1}
                    isProcessing={
                      generationProcess == generationProcessStage.Start
                    }
                  >
                    <div className="p-2 rounded">
                      <div>{getPlaceHolder( syncSpaceTargetFile.name)}</div>
                      <div
                        style={{
                          backgroundColor: theme.neutral100,
                          wordWrap: "break-word",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "break-word",
                        }}
                        className="p-2"
                      >
                        <div
                          className="items-center text-sm h-100"
                          style={{ minHeight: "40px" }}
                        >
                          { syncSpaceTargetFile.name}
                        </div>
                      </div>
                    </div>
                  </FileVisualDiv>
                )}
              </div>

              {/* Row 1.2 */}
              <div className=" flex justify-center items-center w-20">
                { syncSpaceTargetFile && associatedData && (
                  <Arrow theme={theme} direction="right" />
                )}
              </div>

              {/* Row 1.3 */}
              <div className="flex justify-center items-end w-40">
                { syncSpaceTargetFile && associatedData && (
                  <>
                    {generationProcess === generationProcessStage.Prepare && (
                      <FileVisualDiv
                        isProcessing={false}
                        theme={theme}
                        dotted={false}
                        opacity={0.5}
                        style={{
                          borderColor: newData
                            ? theme.brand500
                            : theme.brand1000,
                        }}
                      >
                        <div className="p-2">
                          <div>{getPlaceHolder("new " +  syncSpaceTargetFile.name)}</div>
                          <div
                            style={{
                              backgroundColor: theme.neutral100,
                              wordWrap: "break-word",
                              whiteSpace: "pre-wrap",
                              overflowWrap: "break-word",
                            }}
                            className="p-2"
                          >
                            <div
                              className="items-center text-sm h-100"
                              style={{ minHeight: "40px" }}
                            >
                              {"numaira output "}
                            </div>
                          </div>
                        </div>
                      </FileVisualDiv>
                    )}

                    {generationProcess === generationProcessStage.Start && (
                      <LoadingNumariaVisualDiv theme={theme}>
                        <div className="flex flex-col justify-center w-full h-full items-center p-3">
                          <LogoSVG
                            width={90}
                            height={90}
                            fill={theme.brand500}
                          />
                          <ProgressBar
                            // duration={5000}
                            isComplete={generationCompleteBuffer}
                          />
                          <div
                            className="flex justify-center items-center"
                            style={{
                              color: theme.neutral700,
                              fontSize: format.textXS,
                            }}
                          >
                            Preparing Your Document...
                          </div>
                        </div>
                      </LoadingNumariaVisualDiv>
                    )}
                    {generationProcess === generationProcessStage.Finish && (
                      <FileVisualDiv
                        isProcessing={false}
                        theme={theme}
                        dotted={false}
                        opacity={1}
                        style={{
                          borderColor: theme.brand500,
                        }}
                      >
                        <div className="p-2">
                          <div>{getPlaceHolder("new " +  syncSpaceTargetFile.name)}</div>
                          <div
                            style={{
                              backgroundColor: theme.neutral100,
                              wordWrap: "break-word",
                              whiteSpace: "pre-wrap",
                              overflowWrap: "break-word",
                            }}
                            className="p-2"
                          >
                            <div
                              className="items-center text-sm h-100"
                              style={{ minHeight: "40px" }}
                            >
                              {"numaira output "}
                            </div>
                          </div>
                        </div>
                      </FileVisualDiv>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex  justify-center gap-10 h-20 p-4">
              {/* Row 2.1 */}
              <div className=" flex justify-center items-center w-40">
                { syncSpaceTargetFile && <Arrow theme={theme} direction="up" />}
              </div>
              {/* Row 2.2 */}
              <div className=" flex justify-center items-center w-20">
                { syncSpaceTargetFile == null && <VisualPlaceholder text="Target File" />}
              </div>

              {/* Row 2.3 */}
              <div className=" flex justify-center items-center w-40">
                { syncSpaceTargetFile && associatedData && (
                  <Arrow theme={theme} direction="up" />
                )}
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex  justify-center gap-10 h-100">
              {/* Row 3.1 */}
              <div className=" flex justify-center items-start  w-40">
                { syncSpaceTargetFile && (
                  <div className="flex flex-col justify-center items-center">
                    {!associatedData ? (
                      <VisualPlaceholder text="Associated Data" />
                    ) : (
                      <FileVisualDiv
                        theme={theme}
                        dotted={true}
                        opacity={1}
                        isProcessing={
                          generationProcess == generationProcessStage.Start
                        }
                      >
                        <div className="p-2">
                          <div>{getPlaceHolder(associatedData.name)}</div>
                          <div
                            style={{
                              backgroundColor: theme.neutral100,
                              wordWrap: "break-word",
                              whiteSpace: "pre-wrap",
                              overflowWrap: "break-word",
                            }}
                            className="p-2"
                          >
                            <div
                              className="items-center text-sm h-100"
                              style={{ minHeight: "40px" }}
                            >
                              {associatedData.name}
                            </div>
                          </div>
                        </div>
                      </FileVisualDiv>
                    )}
                  </div>
                )}
              </div>
              {/* Row 3.2*/}
              <div className=" flex justify-center items-start w-20"></div>
              {/* Row 3.3 */}
              <div className="flex justify-center items-start w-40">
                { syncSpaceTargetFile && associatedData && (
                  <div className="flex flex-col justify-center items-center">
                    {!newData ? (
                      <VisualPlaceholder text="New Data" />
                    ) : (
                      <FileVisualDiv
                        theme={theme}
                        dotted={true}
                        opacity={1}
                        isProcessing={
                          generationProcess == generationProcessStage.Start
                        }
                      >
                        <div className="p-2">
                          <div>{getPlaceHolder(newData.name)}</div>
                          <div
                            style={{
                              backgroundColor: theme.neutral100,
                              wordWrap: "break-word",
                              whiteSpace: "pre-wrap",
                              overflowWrap: "break-word",
                            }}
                            className="p-2"
                          >
                            <div
                              className="items-center text-sm h-100"
                              style={{ minHeight: "40px" }}
                            >
                              {newData.name}
                            </div>
                          </div>
                        </div>
                      </FileVisualDiv>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncSpace;
