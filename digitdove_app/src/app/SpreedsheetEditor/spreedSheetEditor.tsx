"use client";
"use client";

import React, { useState, memo } from "react";
import { read, utils } from "xlsx"; // Import xlsx functions to read and parse Excel
import DataGrid, { CellClickArgs, CellMouseEvent, RenderRowProps, Row } from "react-data-grid"; // Import React Data Grid
import "react-data-grid/lib/styles.css"; // Import the default styles for React Data Grid

// Define the structure for rows and columns in React Data Grid
type Row = { [key: string]: string | number };
type Column = { key: string; name: string };

interface SelectedCell {
  rowIdx: number;
  colIdx: number;
}

const SpreadsheetEditor: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]); // Grid columns state
  const [rows, setRows] = useState<Row[]>([]); // Grid rows state
  const [sheetNames, setSheetNames] = useState<string[]>([]); // List of all sheets
  const [selectedSheet, setSelectedSheet] = useState<string>(""); // Currently selected sheet
  const [workbook, setWorkbook] = useState<any>(null); // Store the workbook file

  const [startCell, setStartCell] = useState<SelectedCell | null>(null); // Starting point for selection
  const [endCell, setEndCell] = useState<SelectedCell | null>(null); // Starting point for selection
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]); // Selected cells
  const [isSelecting, setIsSelecting] = useState<boolean>(false); // Track selection state

  // Function to handle file upload (read and parse Excel file)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (typeof data === "string" || data instanceof ArrayBuffer) {
          // Parse the file using xlsx
          const workbookData = read(data, { type: "binary" });
          const sheets = workbookData.SheetNames; // Get all the sheet names

          // Store the workbook and sheet names in state
          setWorkbook(workbookData);
          setSheetNames(sheets);
          setSelectedSheet(sheets[0]);

          // Load the first sheet by default
          loadSheet(workbookData, sheets[0]);
        }
      };
      reader.readAsBinaryString(file); // Read file as binary string
    }
  };

  // ! here we are pushing the grid one row down so we can select headers :) 
  const loadSheet = (workbook: any, sheetName: string) => {
    const sheet = workbook.Sheets[sheetName];
  
    // Get the range of cells in the sheet (this includes empty columns)
    const range = utils.decode_range(sheet["!ref"] as string);
  
    const gridColumns: Column[] = [];
    const headersRow: Row = {}; // The first row that will act as the "headers"
  
    // Iterate over the columns to create the headers row and empty placeholders for the actual headers
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = utils.encode_cell({ r: range.s.r, c: C }); // Cell address in A1 notation
      const cell = sheet[cellAddress]; // Get the cell from the sheet
  
      let header = cell ? String(cell.v) : ""; // If the cell is empty, assign an empty string
      header = header.trim(); // Remove any extra whitespace
  
      // Assign the header to the first row of data (headersRow)
      headersRow[`col_${C}`] = header; // Store the header in the row
  
      // Add empty placeholders for the column headers
      gridColumns.push({
        key: `col_${C}`, // Use unique key for columns
        name: "", // Empty header name so the headers will be part of the content
      });
    }
  
    // Convert the sheet to JSON (array of arrays) using the header row
    const jsonData = utils.sheet_to_json<Row>(sheet, { header: 1 });
  
    // Remove the first row from jsonData (it represents the headers) to avoid duplication
    const rowData = jsonData.slice(1); // Remaining data
  
    // Insert the headersRow at the top of the rowData
    const gridRows = [headersRow, ...rowData.map((row) => {
      const rowObj: Row = {};
      gridColumns.forEach((col, index) => {
        rowObj[col.key] = row[index] || ""; // Handle empty cell values
      });
      return rowObj;
    })];
  
    setColumns(gridColumns); // Set the columns in the state
    setRows(gridRows); // Set the rows in the state
  };
  

  // Function to handle sheet selection
  const handleSheetSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSheet = event.target.value;
    setSelectedSheet(selectedSheet);

    if (workbook) {
      loadSheet(workbook, selectedSheet); // Load the selected sheet using the stored workbook
    }
  };

  // Helper function to get the row index from the row object
  const getRowIdx = (row: Row) => {
    return rows.findIndex((r) => r === row); // Find the index of the row in the rows array
  };

  // Handle cell click to start/stop selection
  const handleCellClick = (row: Row, columnKey: string, target: any) => {
    console.log(row, columnKey, target);
    const rowIdx = getRowIdx(row); // Get the row index from the row
    const colIdx = columns.findIndex((col) => col.key === columnKey); // Get the column index from the column key
  
    if (!isSelecting) {
      // Start selection
      setStartCell({ rowIdx, colIdx });
      setSelectedCells([{ rowIdx, colIdx }]); // Initially select the clicked cell
      setIsSelecting(true); // Enable selecting mode
    } else {
      // End selection (second click)
      const endCell = { rowIdx, colIdx };
      const newSelectedCells: SelectedCell[] = [];
  
      // Calculate the min and max indices for rows and columns
      const minRow = Math.min(startCell!.rowIdx, endCell.rowIdx);
      const maxRow = Math.max(startCell!.rowIdx, endCell.rowIdx);
      const minCol = Math.min(startCell!.colIdx, endCell.colIdx);
      const maxCol = Math.max(startCell!.colIdx, endCell.colIdx);
  
      // Iterate over the range of rows and columns and add each cell to the selection
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          newSelectedCells.push({ rowIdx: r, colIdx: c });
        }
      }
  
      // Add 'selected-cell' class to each cell in the selection
      applySelection(newSelectedCells);
  
      setSelectedCells(newSelectedCells); // Set all the selected cells in the range
      setIsSelecting(false); // Disable selecting mode
    }
  };
  
  // Function to apply the 'selected-cell' class to each selected cell
  const applySelection = (selectedCells: SelectedCell[]) => {
    // Loop through each selected cell
    for (let cell of selectedCells) {
      const rowIdx = cell.rowIdx + 2; // aria-rowindex is 1-based and we dragged the form one line lower, so we add 2
      const colIdx = cell.colIdx + 1; // aria-colindex is 1-based, so we add 1
  
      // Query the row based on aria-rowindex
      const rowElement = document.querySelector(`[aria-rowindex="${rowIdx}"]`);
  
      if (rowElement) {
        // Query the cell based on aria-colindex within the row
        const cellElement = rowElement.querySelector(`[aria-colindex="${colIdx}"]`);
        if (cellElement) {
          cellElement.classList.add('selected-cell'); // Add the CSS class to highlight the cell
        }
      }
    }
  };
  

  // Function to apply custom styles to selected cells
  const isSelected = (rowIdx: number, colIdx: number) => {
    return selectedCells.some(
      (cell) => cell.rowIdx === rowIdx && cell.colIdx === colIdx
    );
  };

  return (
    <div>
      <h2>Spreadsheet Editor</h2>

      {/* File input to upload Excel files */}
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        style={{ marginBottom: "20px" }}
      />

      {/* Sheet selector */}
      {sheetNames.length > 0 && (
        <select value={selectedSheet} onChange={handleSheetSelect}>
          {sheetNames.map((sheetName) => (
            <option key={sheetName} value={sheetName}>
              {sheetName}
            </option>
          ))}
        </select>
      )}

      {/* Render the React Data Grid */}
      {columns.length > 0 && rows.length > 0 ? (
        <DataGrid
          columns={columns}
          rows={rows}
          style={{ height: 500 }}
          onCellClick={(args: CellClickArgs<any, any>, event: CellMouseEvent) =>
            handleCellClick(args.row, args.column.key, event.target)
          } // Use row and column key
          //   onCellMouseEnter={(args) => handleCellMouseEnter(args.row, args.column.key)} // Use row and column key
          //   renderers={renderCell} // Custom renderer for cells
        />
      ) : (
        <p>Please upload an Excel file to view the data.</p>
      )}

      <style>{`
        .selected-cell {
          background-color: lightblue !important;
        }
      `}</style>
    </div>
  );
};

export default SpreadsheetEditor;
