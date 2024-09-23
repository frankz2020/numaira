"use client";

import React, { useState } from 'react';
import { read, utils } from 'xlsx'; // Import xlsx functions to read and parse Excel
import DataGrid from 'react-data-grid'; // Import React Data Grid
import 'react-data-grid/lib/styles.css'; // Import the default styles for React Data Grid

// Define the structure for rows and columns in React Data Grid
type Row = { [key: string]: string | number };
type Column = { key: string; name: string };

const SpreadsheetEditor: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]); // Grid columns state
  const [rows, setRows] = useState<Row[]>([]); // Grid rows state

  // Function to handle file upload (read and parse Excel file)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (typeof data === 'string' || data instanceof ArrayBuffer) {
          // Parse the file using xlsx
          const workbook = read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0]; // Read the first sheet
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

          // Print the processed columns (for debugging)
          console.log("Processed Columns:", gridColumns);

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
        }
      };
      reader.readAsBinaryString(file); // Read file as binary string
    }
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

      {/* Render the React Data Grid */}
      {columns.length > 0 && rows.length > 0 ? (
        <DataGrid
          columns={columns} // Ensure that columns are properly passed
          rows={rows} // Ensure that rows are properly passed
          style={{ height: 500 }} // Set the grid height
        />
      ) : (
        <p>Please upload an Excel file to view the data.</p>
      )}
    </div>
  );
};

export default SpreadsheetEditor;
