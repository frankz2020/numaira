"use client";
"use client";

import React, { useState } from 'react';
import { read, utils } from 'xlsx'; // Import xlsx functions to read and parse Excel
import DataGrid, { CellClickArgs, CellMouseEvent } from 'react-data-grid'; // Import React Data Grid
import 'react-data-grid/lib/styles.css'; // Import the default styles for React Data Grid

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
  const [selectedSheet, setSelectedSheet] = useState<string>(''); // Currently selected sheet
  const [workbook, setWorkbook] = useState<any>(null); // Store the workbook file

  const [startCell, setStartCell] = useState<SelectedCell | null>(null); // Starting point for selection
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]); // Selected cells
  const [isSelecting, setIsSelecting] = useState<boolean>(false); // Track selection state

  // Function to handle file upload (read and parse Excel file)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (typeof data === 'string' || data instanceof ArrayBuffer) {
          // Parse the file using xlsx
          const workbookData = read(data, { type: 'binary' });
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

  // Function to load the selected sheet
  const loadSheet = (workbook: any, sheetName: string) => {
    const sheet = workbook.Sheets[sheetName];

    // Get the range of cells in the sheet (this includes empty columns)
    const range = utils.decode_range(sheet['!ref'] as string);

    // Manually extract the headers from the first row
    const headers: string[] = [];
    const gridColumns: Column[] = [];
    
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = utils.encode_cell({ r: range.s.r, c: C }); // Cell address in A1 notation
      const cell = sheet[cellAddress]; // Get the cell from the sheet

      let header = cell ? String(cell.v) : ''; // If the cell is empty, assign an empty string
      header = header.trim(); // Remove any extra whitespace

      // If the header is empty, assign it a unique internal key, but keep the display name empty
      const internalKey = header === '' ? `empty_${C}` : header;
      headers.push(internalKey); // Add the internal key to headers

      gridColumns.push({
        key: internalKey, // Unique internal key
        name: header === '' ? '' : header, // Keep the display name blank if the header is empty
      });
    }

    // Convert the sheet to JSON (array of arrays) using headers
    const jsonData = utils.sheet_to_json<Row>(sheet, { header: 1 });

    // Remove the first row from jsonData (it represents the headers)
    const rowData = jsonData.slice(1); // Remaining data

    // Map data rows
    const gridRows = rowData.map((row) => {
      const rowObj: Row = {};
      headers.forEach((header, index) => {
        rowObj[header] = row[index] || ''; // Handle empty cell values
      });
      return rowObj;
    });

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
  const handleCellClick = (row: Row, columnKey: string, target: any ) => {
    const rowIdx = getRowIdx(row); // Get the row index from the row
    const colIdx = columns.findIndex((col) => col.key === columnKey); // Get the column index from column key

    console.log('Cell clicked:', rowIdx, colIdx);
    console.log(target)
    target.classList.add('selected-cell');
    if (!isSelecting) {
      // Start selection
      setStartCell({ rowIdx, colIdx });
      setSelectedCells([{ rowIdx, colIdx }]); // Select the clicked cell
      setIsSelecting(true);
    } else {
      // End selection
      setIsSelecting(false);
    }
  };

  // Handle mouse move over the grid to select a range of cells
  const handleCellMouseEnter = (row: Row, columnKey: string) => {
    if (isSelecting && startCell) {
      const rowIdx = getRowIdx(row);
      const colIdx = columns.findIndex((col) => col.key === columnKey);

      const newSelectedCells: SelectedCell[] = [];

      const minRow = Math.min(startCell.rowIdx, rowIdx);
      const maxRow = Math.max(startCell.rowIdx, rowIdx);
      const minCol = Math.min(startCell.colIdx, colIdx);
      const maxCol = Math.max(startCell.colIdx, colIdx);

      // Add all cells between the start cell and the current cell
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          newSelectedCells.push({ rowIdx: r, colIdx: c });
        }
      }

      setSelectedCells(newSelectedCells);
    }
  };

  // Function to apply custom styles to selected cells
  const isSelected = (rowIdx: number, colIdx: number) => {
    return selectedCells.some(cell => cell.rowIdx === rowIdx && cell.colIdx === colIdx);
  };

  // Render custom cell with conditional styling
  const renderCell = (props: any) => {
    const { row, column } = props;
    const rowIdx = getRowIdx(row);
    const colIdx = columns.findIndex((col) => col.key === column.key);

    const isSelectedCell = isSelected(rowIdx, colIdx);

    const style = isSelectedCell
      ? { backgroundColor: 'lightblue' }
      : {};

    return <div style={style}>{props.children}</div>;
  };

  return (
    <div>
      <h2>Spreadsheet Editor</h2>

      {/* File input to upload Excel files */}
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        style={{ marginBottom: '20px' }}
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
          onCellClick={(args : CellClickArgs<any, any>, event: CellMouseEvent) => handleCellClick(args.row, args.column.key, event.target)} // Use row and column key
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
