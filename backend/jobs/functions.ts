import XLSX from "xlsx";

export function processXlsFile(file: string) {
    // Load the Excel file
    const workbook = XLSX.readFile(file);

    // Get the first worksheet (you can also specify a specific sheet by name: workbook.Sheets[sheetName])
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet to JSON
    return XLSX.utils.sheet_to_json(worksheet);
}
