"use client";
import React, { useState } from "react";
import { TitleText } from "@/app/components/generalStyleComponents";

enum Stages {
  UploadSource,
  SelectTemplate,
  CustomizeTemplate,
  Review,
  Publish,
}
const SyncSpace = () => {

  const [stage, setStage] = useState(Stages.UploadSource);
  let stageText = "";
  switch (stage) {
    case Stages.UploadSource:
      stageText = "Upload Source";
      break;
    case Stages.SelectTemplate:
      stageText = "Select Template";
      break;
    case Stages.CustomizeTemplate:
      stageText = "Customize Template";
      break;
    case Stages.Review:
      stageText = "Review";
      break;
    case Stages.Publish:
      stageText = "Publish";
      break;
    default:
      stageText = "";
  }

  return (
    <div>
      <TitleText>SyncSpace</TitleText>
      <div>{stage + 1}/5 {stageText}</div>
    </div>
  );
};

export default SyncSpace;
