"use client";

import React, { useState } from "react";
import { TitleText } from "@/app/components/generalStyleComponents";
import ProcessBar from "./processBar";
import { useTheme } from "@/app/providers/ThemeContext";
import { useFormat } from "@/app/providers/FormatContext";
import styled from "styled-components";
import PDFimage from "../../assets/placeholder/pdfFrame.svg";
import XLSXimage from "../../assets/placeholder/xlsxFrame.svg";
import DOCXimage from "../../assets/placeholder/docxFrame.svg";
import CloseIcon from "../../assets/close.svg";
export enum Stages {
  UploadSource,
  SelectTemplate,
  AssociateAndSync,
  Review,
}

const FileInput = styled.input`
  display: none;
`;

const UploadContainer = styled.div`
  min-height: 450px;
  min-width: 600px;
  border: 2px dotted ${(props) => props.theme.neutral700};
  border-radius: ${(props) => props.format.roundmd};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  margin-right: 1rem;
  padding: 20px;
  text-align: center;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  margin-right: 10px;
`;

const FileDiv = styled.div`
  min-width: 450px;
  height: auto;
  align-items: center;
  border-radius: 8px;
  background-color: ${(props) => props.theme.neutral100} !important;
`;

const SyncSpace = () => {
  const [stage, setStage] = useState(Stages.UploadSource);
  const [fileList, setFileList] = useState<File[]>([]);
  const { theme } = useTheme();
  const { format } = useFormat();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile != null && selectedFile.type === "application/pdf") {
      setFileList([...fileList, selectedFile]);
    }
  };

  const handleClick = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput.click();
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

  const removeFile = (index: number) => {
    const newList = fileList.filter((file, i) => i !== index);
    setFileList(newList);
  };

  let stageText = "";
  switch (stage) {
    case Stages.UploadSource:
      stageText = "Upload Source";
      break;
    case Stages.SelectTemplate:
      stageText = "Select Template";
      break;
    case Stages.AssociateAndSync:
      stageText = "Associate and Sync";
      break;
    case Stages.Review:
      stageText = "Review";
      break;
    default:
      stageText = "";
  }
  return (
    <div className="h-100">
      <TitleText>SyncSpace</TitleText>
      <div className="flex justify-center w-100 me-3">
        <ProcessBar stage={stage} setStage={setStage} />
      </div>

      <section
        className="mt-2 "
        style={{ height: "60vh", overflowX: "scroll" }}
      >
        {stage === Stages.UploadSource && (
          <div
            className="flex overflow-x-scroll flex-nowrap w-100"
            style={{ overflowX: "scroll" }}
          >
            <FileInput
              id="fileInput"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            {fileList.length > 0 && (
              <>
                {fileList.map((file, index) => (
                  <FileDiv theme={theme} key={index} className={"p-2 m-2"}>
                    <div
                      className="p-2"
                      style={{ backgroundColor: theme.neutral300 }}
                    >
                      <div>{getPlaceHolder(file.name)}</div>

                      <div
                        style={{ backgroundColor: theme.neutral100 }}
                        className={"p-4 flex justify-between"}
                      >
                        <div className="item-center">
                          {index} {file.name}
                        </div>
                        <div
                          className="p-2 cursor-pointer"
                          onClick={() => {
                            removeFile(index);
                          }}
                        >
                          <CloseIcon />
                        </div>
                      </div>
                    </div>
                  </FileDiv>
                ))}
              </>
            )}
            <UploadContainer
              theme={theme}
              format={format}
              className=" flex-shrink-0 grow"
            >
              <div className="flex flex-col justify-center">
                <div className="font-bold">
                  Choose a file or drag & drop it here
                </div>
                PDF, docx, and xlsx formats, up to 10MB
                <button
                  onClick={handleClick}
                  className="py-1"
                  style={{
                    backgroundColor: theme.brand,
                    border: `${"2px solid " + theme.brand500}`,
                    borderRadius: format.roundmd,
                    color: theme.brand500,
                    cursor: "pointer",
                  }}
                >
                  Browse File
                </button>
              </div>
            </UploadContainer>
          </div>
        )}
        {stage === Stages.SelectTemplate && <>Choose output template</>}
        {stage === Stages.AssociateAndSync && <>AssociateAndSync</>}
        {stage === Stages.Review && <>Review</>}
      </section>

      <div className=" flex flex-col justify-end">
        <div className="flex justify-end me-5 h-100">
          {stage > Stages.UploadSource && (
            <button
              className="px-3 py-2 m-4"
              onClick={() => {
                setStage(stage - 1);
              }}
              style={{
                backgroundColor: theme.brand,
                color: theme.brand500,
                borderRadius: format.roundmd,
                border: "2px solid " + theme.brand500,
              }}
            >
              Back
            </button>
          )}

          <button
            className="px-3 py-2 m-4"
            onClick={() => {
              if (stage < Stages.Review) {
                setStage(stage + 1);
              } else {
                console.log("done");
              }
            }}
            style={{
              backgroundColor: theme.brand500,
              color: theme.neutral,
              borderRadius: format.roundmd,
            }}
          >
            Save & Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncSpace;
