import React, { useState } from "react";
import { useTheme } from "../providers/ThemeContext";
import { useFormat } from "../providers/FormatContext";
import MoreInfoSVG from "../assets/moreInfo.svg";
type StepHeaderProps = {
  order: number;
  name: string;
  finished: boolean;
  atStage: boolean;
  information: string;
};
const StepHeader = (props: StepHeaderProps) => {
  const { name, order, finished, atStage } = props;
  const { theme } = useTheme();
  const { format } = useFormat();
  const [showInfo, setShowInfo] = useState(false);

  const generalStyle = {
    color: finished ? theme.brand500 : theme.neutral700,
  };
  return (
    <div
      className="flex items-center gap-2 px-2 mt-4 py-4"
      style={{
        backgroundColor: atStage ? theme.brand500 : theme.neutral,
        borderBottom: finished
          ? "2px solid " + theme.neutral200
          : " 2px solod " + theme.neutral,
        borderTopLeftRadius: format.roundmd,
        borderTopRightRadius: format.roundmd,
        transition: 'backgroundColor ease-in'
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: "28px",
          height: "28px",
          border: finished
            ? "2px solid " + theme.brand500
            : atStage
            ? "2px solid " + theme.neutral
            : "2px solid " + theme.neutral200,
          backgroundColor: atStage ? theme.neutral : theme.neutral00,
          color: atStage || finished ? theme.brand500 : theme.neutral700,
          borderRadius: format.roundmd,
          fontSize: format.textMD,
        }}
      >
        {order}
      </div>
      <div
        style={{
          fontSize: format.textMD,
          fontWeight: 700,
          color: atStage
            ? theme.neutral
            : finished
            ? theme.neutra500
            : theme.neutral700,
        }}
      >
        {name}
      </div>
      <div
        onMouseOver={() => {
          setShowInfo(true);
        }}
        onMouseOut={() => setShowInfo(false)}
      >
        <MoreInfoSVG width={16} height={16} fill={atStage ? theme.neutral : theme.neutral700} />
      </div>

      <div>
        {showInfo && (
          <div
            className="absolute"
            style={{
              fontSize: "15px",
              backgroundColor: theme.neutral100,
              border: "1px solid " + theme.neutral200,
              borderRadius: format.roundmd,
              padding: "10px",
            }}
          >
            {props.information}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepHeader;
