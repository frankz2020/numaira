import React, { useEffect, useState } from "react";
import { Stages } from "./page";
import { useFormat } from "@/app/providers/FormatContext";
import { useTheme } from "@/app/providers/ThemeContext";
import styled from "styled-components";
const ProcessBar = (props: {
  stage: Stages;
  setStage: React.Dispatch<React.SetStateAction<Stages>>;
}) => {
  const { theme } = useTheme();
  const { format } = useFormat();
  const [selected, setSelected] = useState(Stages.UploadSource);
  const stages = [
    Stages.UploadSource,
    Stages.SelectTemplate,
    Stages.Review
  ];

  useEffect(() => {
    setSelected(props.stage)
  }, [props.stage])
  return (
    <div className="flex">
      {stages.map((stage: Stages) => {
        return (
          <ProcessBarBrick
            key={stage}
            stage={stage}
            selected={selected}
            onPress={() => {
              console.log("pressed");
              setSelected(stage);
              props.setStage(stage)
            }}
          />
        );
      })}
    </div>
  );
};

const ProcessBarBrick = (props: {
  stage: Stages;
  onPress: () => void;
  selected: Stages;
}) => {
  let stageText = "";
  const { theme } = useTheme();
  const { format } = useFormat();

  switch (props.stage) {
    case Stages.UploadSource:
      stageText = "Upload Source";
      break;
    case Stages.SelectTemplate:
      stageText = "Choose Output";
      break;
    case Stages.Review:
      stageText = "Review & Export";
      break;
    default:
      stageText = "";
  }

  const StyledTopBar = styled.div`
    background-color: ${(props) => props.theme.neutral100};
    min-width: 270px;
    border-bottom: 2px solid
      ${(props) =>
        props.selected ? props.theme.neutral1000 : props.theme.neutral100};
    transition: all 0.3s ease;
    padding: 0.5rem 1.25rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
  `;

  return (
    <>
      <StyledTopBar
        theme={theme}
        selected={props.selected >= props.stage}
        onClick={props.onPress}
      >
        {stageText}
      </StyledTopBar>
    </>
  );
};

export default ProcessBar;
