const ExcelJS = require('exceljs');
const FileSaver = require('file-saver');

function exportToExcel(data, headerLabelMap, fileName) {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('Sheet 1');

	// Create headers from the default column keys
	const headers = Object.keys(data[0]);
	console.log(headerLabelMap)
	worksheet.addRow(headers.map((header) => headerLabelMap.find((label) => label.key === header)?.label || header));

	// Add data to the worksheet
	data.forEach((item) => {
		const rowData = headers.map((header) => item[header]);
		worksheet.addRow(rowData);
	});

	// Set column widths (optional)
	worksheet.columns = headers.map((header) => ({
		header,
		key: header,
		width: 20,
	}));

	// Generate Excel file as a blob
	workbook.xlsx.writeBuffer().then((buffer) => {
		const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

		// Use FileSaver to save the blob as a file
		FileSaver.saveAs(blob, fileName);
	});
}

export default exportToExcel;