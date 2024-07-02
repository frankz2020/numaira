"use client";

import React, { useState } from "react";
import { TitleText } from "@/app/components/generalStyleComponents";
import ProcessBar from "./processBar";
import { useTheme } from "@/app/providers/ThemeContext";
import { useFormat } from "@/app/providers/FormatContext";
import styled from "styled-components";

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

const SyncSpace = () => {
  const [stage, setStage] = useState(Stages.UploadSource);
  const [file, setFile] = useState<File | null>(null);
  const { theme } = useTheme();
  const { format } = useFormat();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile != null && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleClick = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput.click();
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
      <ProcessBar stage={stage} setStage={setStage} />
      <section className="mt-2" style={{ height: "60vh" }}>
        {stage === Stages.UploadSource && (
          <UploadContainer theme={theme} format={format}>
            <FileInput
              id="fileInput"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            {file ? (
              <FileInfo>
                <Avatar theme={theme}>
                  {file.name.charAt(0).toUpperCase()}
                </Avatar>
                <span>{file.name}</span>
              </FileInfo>
            ) : (
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
            )}
          </UploadContainer>
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
