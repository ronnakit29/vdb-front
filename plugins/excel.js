const ExcelJS = require('exceljs');
const FileSaver = require('file-saver');

function exportToExcel(data, headerData, fileName) {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('Sheet 1');

	// Create headers from the default column keys
	console.log("header map", headerData)
	worksheet.addRow(headerData.map((item) => item.label));

	// Add data to the worksheet
	data.forEach((item) => {
		const rowData = headerData.map((header) => item[header.key]);
			worksheet.addRow(rowData);
	});

	// Set column widths (optional)
	worksheet.columns = headerData.map((header) => ({
		header: header.label,
		key: header.key,
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