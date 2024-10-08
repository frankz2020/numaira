"use client";
import { useState, useCallback, useEffect } from "react";
import { Spreadsheet, CellBase, Matrix } from "react-spreadsheet";
import { read, utils } from "xlsx";
import { memo } from "react";
import { loadSheet } from "./utils";
type SpreadsheetData = (string | number | null)[][];
type Row = { [key: string]: string | number | undefined }; // Define the Row type

interface SelectedCell {
  rowIdx: number;
  colIdx: number;
}

interface SelectedCellWithData {
  label: string;
  header: string;
  value: string;
}

const SpreadsheetEditor = ({
  inputExcel,
  onSubmit,
}: {
  inputExcel?: File;
  onSubmit?: () => void;
}) => {
  const [data, setData] = useState<Matrix<CellBase<any>>>([]); // Spreadsheet data as CellBase<any> type
  const [isSelecting, setIsSelecting] = useState(false); // Tracks if the user is currently selecting cells
  const [startCell, setStartCell] = useState<SelectedCell | null>(null); // Start cell for selection
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]); // Track selected cells
  const [hoveredCells, setHoveredCells] = useState<SelectedCell[]>([]); // Track hovered cells for hint
  const [labelSelect, setLabelSelect] = useState<Boolean>(false);

  const [headerCells, setHeaderCells] = useState<SelectedCell[]>([]); // Track header cells selected
  const [labelCells, setLabelCells] = useState<SelectedCell[]>([]); // Track label cells selected

  const [relatedDataCells, setRelatedDataCells] = useState<SelectedCell[]>([]); // Track the data cells related to the selected headers and labels

  const [outputData, setOutputData] = useState<SpreadsheetData>([]); // Output data for the selected cells

  useEffect(() => {
    if (inputExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (typeof data === "string" || data instanceof ArrayBuffer) {
          const workbookData = read(data, { type: "binary" });
          const sheets = workbookData.SheetNames;
          setData(loadSheet(workbookData, sheets[0])); // Load the first sheet by default
        }
      };
      reader.readAsBinaryString(inputExcel);
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (typeof data === "string" || data instanceof ArrayBuffer) {
          const workbookData = read(data, { type: "binary" });
          const sheets = workbookData.SheetNames;
          setData(loadSheet(workbookData, sheets[0])); // Load the first sheet by default
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  // Assuming `data` is the Matrix<CellBase<any>> that holds the spreadsheet data

  const getCellData = (
    selectedCell: SelectedCell,
    data: Matrix<CellBase<any>>
  ): string | null => {
    const { rowIdx, colIdx } = selectedCell;
    // Check if the row and column indices are within the bounds of the data
    if (
      rowIdx >= 0 &&
      rowIdx < data.length &&
      colIdx >= 0 &&
      colIdx < data[rowIdx].length
    ) {
      const cell = data[rowIdx][colIdx];
      if (cell && cell.value) {
        return String(cell.value); // Return the value as a string
      }
    }
    return null; // Return null if the indices are out of bounds or if cell has no value
  };

  // Function to populate SelectedCellWithData from selected cells
  const populateSelectedCellWithData = (): { [key: string]: string } => {
    const result: { [key: string]: string } = {};

    // Iterate over each label cell (X-axis)
    labelCells.forEach((labelCell) => {
      const combinedLabel = getCellData(labelCell, data); // Get label from the selected label cell

      // For each label cell, combine all header cells (Y-axis) to create the full context
      headerCells.forEach((headerCell) => {
        const combinedHeader = getCellData(headerCell, data); // Get header from the selected header cell
        const value = getCellData(
          { rowIdx: labelCell.rowIdx, colIdx: headerCell.colIdx },
          data
        ); // Get the value from the intersection

        // Ensure all parts (header, label, and value) are defined before adding to result
        if (combinedHeader && combinedLabel && value) {
          result[`${combinedHeader}, ${combinedLabel}`] = value;
        }
      });
    });

    return result; // Return the final object
  };

  // Handle data changes in the spreadsheet
  const handleDataChange = (newData: Matrix<CellBase<any>>) => {
    const simpleData: SpreadsheetData = newData.map((row) =>
      row.map((cell) => cell?.value || null)
    );

    console.log("Updated data:", simpleData);
    setData(newData); // Update the spreadsheet with new data
  };

  const MemoizedCell = memo(
    ({ props, handleCellClick, handleCellHover, getCellStyle }: any) => {
      return (
        <td
          {...props}
          onClick={(event) => {
            event.stopPropagation(); // Prevent propagation to parent elements
            handleCellClick(props.row, props.column);
          }}
          onMouseOver={() => handleCellHover(props.row, props.column)} // Track hover events for hint
          style={{
            border: "1px solid lightgrey", // Add cell borders
            padding: "8px", // Add padding for better spacing
            maxWidth: "400px", // Limit the max width of the cell
            textOverflow: "ellipsis", // Add ellipsis for overflowing content
            wordWrap: "break-word", // Enable word wrapping
            whiteSpace: "pre-wrap", // Preserve line breaks and allow wrapping
            ...getCellStyle(props.row, props.column),
          }}
        >
          {props.data?.value || ""}
        </td>
      );
    }
  );

  // Add display name to resolve ESLint warning
  MemoizedCell.displayName = "MemoizedCell";

  // handle cell click to select cells

  const handleCellClick = useCallback(
    (rowIdx: number, colIdx: number) => {
      const newSelectedCells: SelectedCell[] = [];

      if (!isSelecting) {
        setStartCell({ rowIdx, colIdx });
        setSelectedCells([{ rowIdx, colIdx }]);
        setIsSelecting(true);
        setHoveredCells([]);
      } else {
        const endCell = { rowIdx, colIdx };

        const minRow = Math.min(startCell!.rowIdx, endCell.rowIdx);
        const maxRow = Math.max(startCell!.rowIdx, endCell.rowIdx);
        const minCol = Math.min(startCell!.colIdx, endCell.colIdx);
        const maxCol = Math.max(startCell!.colIdx, endCell.colIdx);

        for (let r = minRow; r <= maxRow; r++) {
          for (let c = minCol; c <= maxCol; c++) {
            newSelectedCells.push({ rowIdx: r, colIdx: c });
          }
        }

        if (labelSelect) {
          setLabelCells([...labelCells, ...newSelectedCells]);

          const dataCells: SelectedCell[] = [];
          newSelectedCells.forEach((labelCell) => {
            headerCells.forEach((headerCell) => {
              dataCells.push({
                rowIdx: labelCell.rowIdx,
                colIdx: headerCell.colIdx,
              });
            });
          });
          setRelatedDataCells(dataCells);
        } else {
          setHeaderCells([...headerCells, ...newSelectedCells]);
        }

        setSelectedCells(newSelectedCells);
        setHoveredCells([]);
        setIsSelecting(false);
        setLabelSelect(true);
      }
    },
    [isSelecting, startCell, headerCells, labelCells, labelSelect]
  );

  const handleCellHover = useCallback(
    (rowIdx: number, colIdx: number) => {
      if (!isSelecting || !startCell) return;

      const newHoveredCells: SelectedCell[] = [];

      const minRow = Math.min(startCell.rowIdx, rowIdx);
      const maxRow = Math.max(startCell.rowIdx, rowIdx);
      const minCol = Math.min(startCell.colIdx, colIdx);
      const maxCol = Math.max(startCell.colIdx, colIdx);

      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          newHoveredCells.push({ rowIdx: r, colIdx: c });
        }
      }

      // Only update if hovered cells actually change
      if (JSON.stringify(newHoveredCells) !== JSON.stringify(hoveredCells)) {
        setHoveredCells(newHoveredCells); // Set the hovered cells for the selection hint
      }
    },
    [isSelecting, startCell, hoveredCells] // Depend only on required variables
  );

  // Apply styles to selected or hovered cells
  const getCellStyle = useCallback(
    (rowIdx: number, colIdx: number) => {
      const isHeaderSelected = headerCells.some(
        (cell) => cell.rowIdx === rowIdx && cell.colIdx === colIdx
      );
      const isLabelSelected = labelCells.some(
        (cell) => cell.rowIdx === rowIdx && cell.colIdx === colIdx
      );
      const isRelatedDataSelected = relatedDataCells.some(
        (cell) => cell.rowIdx === rowIdx && cell.colIdx === colIdx
      );
      const isHovered = hoveredCells.some(
        (cell) => cell.rowIdx === rowIdx && cell.colIdx === colIdx
      );

      if (isHeaderSelected) {
        return { backgroundColor: "lightblue", border: "1px solid blue" };
      } else if (isLabelSelected) {
        return { backgroundColor: "lightgreen", border: "1px solid green" };
      } else if (isRelatedDataSelected) {
        return { backgroundColor: "lightcoral", border: "1px solid red" };
      } else if (isHovered) {
        return { backgroundColor: "lightyellow", border: "1px solid yellow" };
      }
      return {};
    },
    [headerCells, labelCells, relatedDataCells, hoveredCells]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        maxHeight: "80vh",
      }}
    >
      <h2>Spreadsheet Editor</h2>
      {!inputExcel && (
        <>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            style={{ marginBottom: "20px" }}
          />
          <div>
            {labelSelect ? (
              <div>Please Select the labels</div>
            ) : (
              <div>Please Select headers</div>
            )}
          </div>
        </>
      )}

      <div
        className="cursor-pointer bg-blue-500 text-white p-2 rounded-md"
        onClick={() => {
          setHeaderCells([]);
          setLabelCells([]);
          setRelatedDataCells([]);
          setLabelSelect(false);
        }}
      >
        Clear My Selection
      </div>
      {data.length > 0 ? (
        <div
          style={{
            width: "100%",
            height: "100%", // Ensure it takes up the full height of its parent
            overflowX: "auto", // Enable horizontal scroll
            overflowY: "auto", // Enable vertical scroll
            border: "1px solid #ccc", // Add a border around the spreadsheet
          }}
        >
          <Spreadsheet
            data={data}
            onChange={handleDataChange}
            Cell={(props) => (
              <MemoizedCell
                props={props}
                handleCellClick={handleCellClick}
                handleCellHover={handleCellHover}
                getCellStyle={getCellStyle}
              />
            )}
          />
        </div>
      ) : (
        <p>Please upload an Excel file to view the data.</p>
      )}

      <button
        onClick={() => {
          console.log(populateSelectedCellWithData());
        }}
      >
        Print Prepared Data
      </button>

      <style>{`
        .selected-cell {
          background-color: lightgreen !important;
        }
        td {
          border: 1px solid #ccc; /* Add borders between cells */
        }
        td:hover {
          background-color: #f1f1f1; /* Light hover effect */
        }
      `}</style>
    </div>
  );
};

export default SpreadsheetEditor;
