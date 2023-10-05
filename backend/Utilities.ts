import {$} from "../app";
import XLSX from 'xlsx';

console.log("Processing xls ---");


const payload = $.path.storage("uploads/upload.xlsx");


// Print the data
export function processXls() {


// Load the Excel file
    const workbook = XLSX.readFile(payload);

// Get the first worksheet (you can also specify a specific sheet by name: workbook.Sheets[sheetName])
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

// Convert the worksheet to JSON
    return XLSX.utils.sheet_to_json(worksheet);


}