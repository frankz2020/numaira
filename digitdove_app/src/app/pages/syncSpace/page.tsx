"use client";
import React, { useState } from "react";
import { useTheme } from "@/app/providers/ThemeContext";
import { useFormat } from "@/app/providers/FormatContext";
import StepHeader from "@/app/components/StepHeader";
import UploadSVG from "@/app/assets/upload.svg";
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
enum SyncSpaceStep {
  TargetFile,
  AssociatedData,
  NewData,
  Generate,
  ReviewExport,
}

const FileDisplayContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 4px;
  background-color: ${(props) => props.theme.neutral};
`;

const FileVisualDiv = styled.div<{
  dotted: boolean;
  theme: any;
  opacity: number;
  borderColor?: string | null;
}>`
  max-width: 280px;
  min-width: 200px;
  width: 25%;
  height: auto;
  min-height: 220px;
  align-items: center;
  border-radius: 8px;
  opacity: ${(props) => props.opacity};
  border: ${(props) =>
    props.dotted
      ? "2px dotted " + props.theme.neutral1000
      : "2px solid " + props.theme.neutral100};
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

const getSyncArrow = (direction: string) => {
  let rotate = 0;
  if (direction === "up") rotate = 0;
  if (direction === "down") rotate = 180;
  if (direction === "right") rotate = 90;
  if (direction === "left") rotate = -90;

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: "100%", height: "100%" }}
    >
      <SyncArrowSVG
        style={{
          transform: `rotate(${rotate}deg)`,
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          margin: "auto",
        }}
      />
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

const HorizontalArrow = styled.div<{ direction: string }>`
  --c: ${(props) => props.theme.neutral700}; /* color */
  --r: 5px; /* circle size */
  --s: 5px; /* space between circles */
  --size: 15px; /* arrow tip size */

  height: 6px;
  width: 100%; /* Adjust width as needed */
  display: inline-block;
  position: relative;
  --g: radial-gradient(circle closest-side, var(--c) 85%, transparent);
  background: var(--g) 0 calc(var(--s) / -2) / var(--r) calc(var(--r) + var(--s))
      repeat-y,
    var(--g) calc(var(--s) / -2) 0 / calc(var(--r) + var(--s)) var(--r) repeat-x;

  &::after {
    content: "";
    position: absolute;
    left: ${(props) => (props.direction === 'left' ? '0' : '100%')};
    top: 50%;
    width: var(--size);
    height: var(--size);
    transform: translate(-50%, -50%) rotate(${(props) => (props.direction === 'left' ? '-90deg' : '90deg')});
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    background: var(--c);
  }
`;

const VerticalArrow = styled.div<{ direction: string }>`
  --c: ${(props) => props.theme.neutral700}; /* color */
  --r: 5px; /* circle size */
  --s: 5px; /* space between circles */
  --size: 15px; /* arrow tip size */

  width: 6px;
  height: 100%; /* Adjust height as needed */
  display: inline-block;
  position: relative;
  --g: radial-gradient(circle closest-side, var(--c) 85%, transparent);
  background: var(--g) calc(var(--s) / -2) 0 / calc(var(--r) + var(--s))
      var(--r) repeat-x,
    var(--g) 0 calc(var(--s) / -2) / var(--r) calc(var(--r) + var(--s)) repeat-y;

  &::after {
    content: "";
    position: absolute;
    top: ${(props) => (props.direction === 'up' ? '0' : '100%')};
    left: 50%;
    width: var(--size);
    height: var(--size);
    transform: translate(-50%, -50%) rotate(${(props) => (props.direction === 'up' ? '0deg' : '180deg')});
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    background: var(--c);
  }
`;

const Arrow: React.FC<{ direction: string; theme: any }> = ({ direction, theme }) => {
  if (direction === 'up' || direction === 'down') {
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
  const { backendUrl } = useGlobalContext();
  const [currentStep, setCurrentStep] = useState(SyncSpaceStep.TargetFile);

  const [targetFile, setTargetFile] = useState<File | null>(null);
  const [targetFileText, setTargetFileText] = useState<string | null>(null);
  const [targetHtmlContent, setTargetHtmlContent] = useState<string>("");

  const [associatedData, setAssociatedData] = useState<File | null>(null);
  const [associatedDataValue, setAssociatedDataValue] = useState<any[] | null>(
    null
  );

  const [newData, setNewData] = useState<File | null>(null);
  const [newDataValue, setNewDataValue] = useState<any[] | null>(null);

  const [startedGeneration, setStartedGeneration] = useState(false);
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
      replaceTextInDocx(results);
      console.log("Data sent to backend successfully");
      console.log("Results:", results); // Log the returned data
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  const replaceTextInDocx = async (replacements: string[][]) => {
    assert(targetFileText != null);
    let updatedText = targetFileText;
    replacements.forEach(([previousValue, newValue]) => {
      const regex = new RegExp(previousValue, "g");
      updatedText = updatedText.replace(regex, newValue);
    });

    // Create a new document with the updated text
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: updatedText.split("\n").map(
            (para) =>
              new Paragraph({
                children: [new TextRun(para)],
              })
          ),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "updated_document.docx");
  };

  return (
    <div className="flex h-100" style={{ height: "100%" }}>
      <div
        className="h-100"
        style={{ width: "30%", backgroundColor: theme.neutral50 }}
      >
        <div className="p-3">
          <div style={{ fontSize: format.displaySM, fontWeight: 400 }}>
            SyncSpace
          </div>
          <div className="text-sm " style={{ color: theme.neutral700 }}>
            Upload documents and generate output
          </div>
        </div>
        <div className="mt-2 mx-2">
          <StepHeader
            order={1}
            name="Target File"
            finished={currentStep > SyncSpaceStep.TargetFile}
            atStage={currentStep == SyncSpaceStep.TargetFile}
            information="Upload your documents here"
          />
          {currentStep == SyncSpaceStep.TargetFile && (
            <UploadButton
              fileType={[".docx"]}
              onClick={async (file: File) => {
                setTargetFile(file);
                setCurrentStep(currentStep + 1);

                try {
                  const arrayBuffer = await file.arrayBuffer();
                  const result = await mammoth.extractRawText({ arrayBuffer });
                  const { value: html, messages } = await mammoth.convertToHtml(
                    { arrayBuffer }
                  );
                  const text = result.value;

                  setTargetFileText(text);
                  setTargetHtmlContent(html);
                  // Now you can send the text to your backend
                } catch (error) {
                  console.error("Error reading .docx file:", error);
                }
              }}
            />
          )}
          {targetFile && (
            <FileDisplayContainer theme={theme}>
              <div className="flex justify-start gap-2 flex-wrap">
                <div>{targetFile.name}</div>
                <div> | </div>
                <div>{(targetFile.size / 1024).toFixed(2)} KB</div>
              </div>

              <div>x</div>
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
                <div> | </div>
                <div>{(associatedData.size / 1024).toFixed(2)} KB</div>
              </div>

              <div>x</div>
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
                <div> | </div>
                <div>{(newData.size / 1024).toFixed(2)} KB</div>
              </div>

              <div>x</div>
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
                  await sendToBackend();
                  setCurrentStep(currentStep + 1);
                }}
                className="px-3 py-2 m-4 flex gap-1"
              >
                <SyncSpaceSVG width={25} height={25} fill={theme.neutral} />
                {startedGeneration ? "Generating..." : "Generate"} 
              </GenerateButton>
            </div>
          )}
          <StepHeader
            order={5}
            name="Review & Export"
            finished={currentStep > SyncSpaceStep.ReviewExport}
            atStage={currentStep == SyncSpaceStep.ReviewExport}
            information="Upload your documents here"
          />
          {currentStep == SyncSpaceStep.ReviewExport && (
            <div
              className=" items-center flex flex-col justify-center p-5"
              style={{
                backgroundColor: theme.neutral,
                border: "2px solid " + theme.brand500,
                borderBottomLeftRadius: format.roundmd,
                borderBottomRightRadius: format.roundmd,
              }}
            >
              <div
                onClick={() => {
                  setCurrentStep(currentStep + 1);
                }}
              >
                Export as DOCX
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="flex justify-center items-center gap-5 p-10"
        style={{ width: "70%" }}
      >
        <div className="flex flex-col justify-center p-4 w-100 h-100"  style={{width: '100%', height: '100%'}}>
          {/* Row 1 */}
          <div className="flex justify-center gap-10 h-100 w-100">
            {/* Row 1.1 */}
            <div className=" flex justify-center items-end  w-40">
              {targetFile != null && (
                <FileVisualDiv dotted={true} theme={theme} opacity={1}>
                  <div
                    className="p-2"
                    style={{ backgroundColor: theme.neutral300 }}
                  >
                    <div>{getPlaceHolder(targetFile.name)}</div>
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
                        {targetFile.name}
                      </div>
                    </div>
                  </div>
                </FileVisualDiv>
              )}
            </div>

            {/* Row 1.2 */}
            <div className=" flex justify-center items-center w-20">
              {targetFile && associatedData && (
                <Arrow theme={theme} direction="right" />
              )}
            </div>

            {/* Row 1.3 */}
            <div className="flex justify-center items-end w-40">
              {targetFile && associatedData && (
                <FileVisualDiv
                  theme={theme}
                  dotted={false}
                  opacity={0.5}
                  style={{
                    borderColor: newData ? theme.brand500 : theme.brand1000,
                  }}
                >
                  <div
                    className="p-2"
                    style={{ backgroundColor: theme.neutral300 }}
                  >
                    <div>{getPlaceHolder("new " + targetFile.name)}</div>
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
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex  justify-center gap-10 h-20 p-4" >
            {/* Row 2.1 */}
            <div className=" flex justify-center items-center w-40">
              {targetFile && <Arrow theme={theme} direction="up" />}
            </div>
            {/* Row 2.2 */}
            <div className=" flex justify-center items-center w-20">
              {targetFile == null && <VisualPlaceholder text="Target File" />}
            </div>

            {/* Row 2.3 */}
            <div className=" flex justify-center items-center w-40">
              {targetFile && associatedData && (
                <Arrow theme={theme} direction="up" />
              )}
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex  justify-center gap-10 h-100">
            {/* Row 3.1 */}
            <div className=" flex justify-center items-start  w-40">
              {targetFile && (
                <div className="flex flex-col justify-center items-center">
                  {!associatedData ? (
                    <VisualPlaceholder text="Associated Data" />
                  ) : (
                    <FileVisualDiv theme={theme} dotted={true} opacity={1}>
                      <div
                        className="p-2"
                        style={{ backgroundColor: theme.neutral300 }}
                      >
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
              {targetFile && associatedData && (
                <div className="flex flex-col justify-center items-center">
                  {!newData ? (
                    <VisualPlaceholder text="New Data" />
                  ) : (
                    <FileVisualDiv theme={theme} dotted={true} opacity={1}>
                      <div
                        className="p-2"
                        style={{ backgroundColor: theme.neutral300 }}
                      >
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
  );
};

type UploadButtonProps = {
  onClick: (file: File) => void;
  fileType: string[] | null;
};
const UploadButton = (props: UploadButtonProps) => {
  const { onClick, fileType } = props;
  const { theme } = useTheme();
  const { format } = useFormat();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onClick(file);
    }
  };
  return (
    <div
      className="p-5"
      style={{
        backgroundColor: theme.neutral,
        border: "2px solid " + theme.brand500,
        borderBottomLeftRadius: format.roundmd,
        borderBottomRightRadius: format.roundmd,
      }}
    >
      <div
        className="p-3 items-center flex flex-col justify-center "
        style={{
          border: "2px dotted " + theme.neutral1000,
          width: "100%",
          borderRadius: format.roundmd,
        }}
      >
        <UploadSVG />
        <div style={{ fontWeight: 700 }}>Drop Files here</div>
        <div style={{ color: theme.neutral700, fontSize: format.textSM }}>
          DOCX Format up to 10MB
        </div>
        <input
          type="file"
          id="fileInput"
          accept={fileType?.toString() ?? ""}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          className="py-2 px-3 m-2"
          onClick={() => document.getElementById("fileInput")?.click()}
          style={{
            backgroundColor: theme.brand500,
            color: theme.neutral,
            borderRadius: format.roundmd,
          }}
        >
          Select File
        </button>
      </div>
    </div>
  );
};

export default SyncSpace;
