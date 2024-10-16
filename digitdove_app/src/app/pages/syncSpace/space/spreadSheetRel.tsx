"use client";
import React from "react";
import { useTheme } from "@/app/providers/ThemeContext";
import { useFormat } from "@/app/providers/FormatContext";
import SpreadsheetEditor from "@/app/SpreedsheetEditor/spreedSheetEditor";
const SpreadSheetRel = ({
  inputExcel,
  onSubmit,
  onBack,
}: {
  inputExcel?: File;
  onSubmit?: () => void;
  onBack?: () => void;
}) => {
  const { theme } = useTheme();
  const { format } = useFormat();
  return (
    <div
      className="p-5 w-100 h-100 mt"
      style={{
        background: theme.neutral,
        marginTop: format.maxTopNavbarHeight,
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-4">
          <div
                className="p-4 cursor-pointer flex items-center justify-center" // Ensure vertical & horizontal centering
                style={{
                  backgroundColor: theme.neutral50,
                  borderRadius: format.roundmd,
                }}
                onClick={() => onBack? onBack() : null}
              >
                Back
              </div>
          <div className="flex flex-col justify-start">
            <div style={{ fontSize: format.textLG }}>
              Select All Tables In Associated Data
            </div>
            <div style={{ fontSize: format.textSM }}>
              Click and drag the table cells to select the relevant areas.
            </div>
          </div>
        </div>
        <div>
            <button onClick={onSubmit}>Submit</button>
        </div>
      </div>

      <>
        <SpreadsheetEditor inputExcel={inputExcel}/>
      </>
    </div>
  );
};

export default SpreadSheetRel;
