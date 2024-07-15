"use client";
import { useFormat } from "@/app/providers/FormatContext";
import { useTheme } from "@/app/providers/ThemeContext";
import React, { useState } from "react";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import DocumentEditor from "./documentEditor";

interface Cell extends CellBase {
  value: string | number | boolean | null;
}

const NewTemplate = () => {
  const { theme } = useTheme();
  const { format } = useFormat();

  const [data, setData] = useState<Matrix<Cell>>([
    [{ value: "" }, { value: "" }, { value: "" }],
    [{ value: "" }, { value: "" }, { value: "" }],
    [{ value: "" }, { value: "" }, { value: "" }],
  ]);

  const addRow = () => {
    setData([...data, new Array(data[0].length).fill({ value: "" })]);
  };

  const addColumn = () => {
    setData(data.map((row) => [...row, { value: "" }]));
  };

  const saveData = () => {
    console.log("Saving data:", data);
    // Implement your save functionality here, e.g., sending data to a backend
  };

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderRadius: "5px",
      }}
    >
      {/* <div style={{ marginTop: "20px" }}>
        <button
        className="p-2"
          onClick={addRow}
          style={{
            marginRight: "10px",
            backgroundColor: theme.brand500,
            borderRadius: format.roundmd,
            color: theme.brand
          }}
        >
          Add Row
        </button>
        <button
        className="p-2"
          onClick={addColumn}
          style={{
            marginRight: "10px",
            backgroundColor: theme.brand500,
            borderRadius: format.roundmd,
            color: theme.brand
          }}
        >
          Add Column
        </button>
        <button
        className="p-2"
          onClick={saveData}
          style={{
            backgroundColor: theme.brand500,
            borderRadius: format.roundmd,
            color: theme.brand
          }}
        >
          Save
        </button>
      </div>
      <h2>Excel Editor</h2>
      <Spreadsheet data={data} onChange={setData} /> */}

      <DocumentEditor />
    </div>
  );
};

export default NewTemplate;
