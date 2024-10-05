import { CellBase, Matrix } from "react-spreadsheet";
import { read, utils } from "xlsx";

type Row = { [key: string]: string | number | undefined }; // Define the Row type
export const loadSheet = (workbook: any, sheetName: string) => {
    const sheet = workbook.Sheets[sheetName];
  
    // Extract JSON data from the sheet, replacing empty values with ""
    const jsonData = utils.sheet_to_json<Row[]>(sheet, {
      header: 1,
      defval: "",
    });
  
    // Extract the first row to use as headers
    const headers = jsonData[0] as unknown as string[]; // First row is assumed to be headers
  
    // Include the headers as the first row of the spreadsheet data
    const spreadsheetData: Matrix<CellBase<any>> = [
      headers.map(header => ({ value: header })), // Add the headers as the first row
      ...jsonData.slice(1).map((row) =>
        headers.map((_, index) => ({
          value: row[index] !== undefined ? row[index] : "", // Use index to access row values
        }))
      ),
    ];
    return spreadsheetData;
    // Update the state with the formatted data, including the headers as the first row
  };