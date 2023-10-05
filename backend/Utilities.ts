import {$} from "../app";
import XLSX from 'xlsx';
import {SheetDataType} from "./models/SheetModel";



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


export function refineData(item: any): SheetDataType | null {
    // Validate or transform the data as needed
    if (!item['Organisation Name']) {
        return null; // or handle the error as you see fit
    }

    return {
        createdAt: new Date(),
        organization_name: item['Organisation Name'],
        town_city: item['Town/City'],
        type_rating: item['Type & Rating'],
        route: item['Route']
    };
}