import Helper from '@/classes/Helper.class';
import axios from 'axios';
import { saveAs } from 'file-saver';
import moment from 'moment';
import THBText from 'thai-baht-text';
const fontkit = require('fontkit');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const readTemplatePDF = async (data = [], file_name) => {
	const fileLocation = {
		business: "template4.pdf",
	}
	const templatePDFBuffer = await axios.get(`/pdf-template/${fileLocation[data[0].type] || 'template3.pdf'}`, { responseType: 'arraybuffer' });
	const bufferData = templatePDFBuffer.data;
	const pdfDoc = await PDFDocument.load(bufferData);
	pdfDoc.registerFontkit(fontkit);

	const page = pdfDoc.getPages()[0];
	const fontSize = 16;
	page.setSize(595, 842)
	const embeddedPage = await pdfDoc.embedPage(page);

	const urlFont = '/pdf-template/THSarabun.ttf';
	const fontBytes = await axios.get(urlFont, { responseType: 'arraybuffer' });
	const embedFont = await pdfDoc.embedFont(fontBytes.data);
	// log height and width
	// set page size
	const typeTxt = {
		short: "สั้น",
		long: "ยาว",
		business: "ธุรกิจ",
	}
	const coordinates = {
		// citizen_id: { x: 100, y: 500 },
		running_number: { x: 110, y: 74 },
		promise_year: { x: 136, y: 74 },
		// datetime: { x: 100, y: 440 },
		datetime_day: { x: 395, y: 100 },
		datetime_month: { x: 452, y: 100 },
		datetime_year: { x: 532, y: 100 },
		working_address: { x: 425, y: 74 },
		village_name: { x: 75, y: 187 },
		age: { x: 491, y: 120 },
		reason: { x: 44, y: 253 },
		amount_format: { x: 429, y: 274 },
		thai_amount: { x: 49, y: 297 },
		expired_day: { x: 97, y: 385 },
		expired_month: { x: 164, y: 385 },
		expired_year: { x: 246, y: 385 },
		member_citizen_id: { x: 175, y: 142 },
		fullname: { x: 180, y: 120 },
		deposit_amount: { x: 488, y: 297 },
		interest: { x: 432, y: 385 },
		hedge_fund: { x: 77, y: 340 },
		loaner_name: { x: 100, y: 528 },
		employee_name: { x: 394, y: 528 },
		manager_name: { x: 388, y: 614 },
		witness1_name: { x: 116, y: 682 },
		witness2_name: { x: 388, y: 682 },
		loaner2_name: { x: 50, y: 725 },
		village2_name: { x: 366, y: 747 },
		witness1_license: { x: 103, y: 826 },
		witness2_license: { x: 368, y: 826 },
		number: { x: 385, y: 142 },
		village: { x: 453, y: 142 },
		subDistrict: { x: 512, y: 142 },
		district: { x: 70, y: 164 },
		province: { x: 170, y: 164 },
		limit_hedgefund_protech: { x: 275, y: 318 },
	};
	// const helveticaFont = await pdfDoc.embedFont(PDFDocument.Fonts.Helvetica);
	data.forEach((value, key) => {
		pdfDoc.insertPage(key);
		const currentPage = pdfDoc.getPages()[key]

		if (value.type !== 'business') {
			currentPage.drawText(`${typeTxt[value.type]}`, {
				x: 465,
				y: currentPage.getHeight() - 34,
				size: 24,
				color: rgb(0, 0, 0), // Black color
				font: embedFont
			});
			currentPage.drawText(`${value.addon ? 'พิเศษ' : ''}`, {
				x: 495,
				y: currentPage.getHeight() - 34,
				size: 16,
				color: rgb(0, 0, 0), // Black color
				font: embedFont
			});
		}
		let ignoreField = [];
		if (value.type === 'business') {
			ignoreField = ['witness1_license', 'witness2_license', 'witness1_name', 'witness2_name', 'village2_name', 'loaner2_name']
		}
		currentPage.drawPage(embeddedPage, {
			x: 0,
			y: 0,
			width: currentPage.getWidth(),
			height: currentPage.getHeight(),
			opacity: 1,
		});
		const prefixesToRemove = ["หมู่ที่", "ตำบล", "อำเภอ", "จังหวัด"];

		// Replace the prefixes with empty strings
		const modifiedAddressText = value.loaner.address.replace(
			new RegExp(prefixesToRemove.join("|"), "g"),
			""
		);

		const newAddress = modifiedAddressText.split(/\s+/);
		const address = {
			number: newAddress[0],        // 59
			village: newAddress[1],       // หมู่ที่ 5
			subDistrict: newAddress[2],   // ตำบลผางาม
			district: newAddress[3],      // อำเภอเวียงชัย
			province: newAddress[4]       // จังหวัดเชียงราย
		};
		value = {
			...value,
			fullname: `${value.title_name}${value.first_name} ${value.last_name}`,
			datetime_day: moment(value.datetime).format('DD'),
			datetime_month: Helper.thaiMonth(moment(value.datetime).format('MM')),
			datetime_year: Number(moment(value.datetime).format('YYYY')) + 543,
			working_address: value?.village?.working_position || '',
			expired_day: moment(value.expired_date).format('DD'),
			expired_month: Helper.thaiMonth(moment(value.expired_date).format('MM')),
			expired_year: Number(moment(value.expired_date).format('YYYY')) + 543,
			amount_format: Helper.formatNumber(value.amount),
			thai_amount: THBText(value.amount),
			village_name: value?.village?.name || '',
			deposit_amount: Helper.formatNumber(value.deposit_amount),
			loaner_name: `${value.title_name}${value.first_name} ${value.last_name}`,
			employee_name: `${value.employee?.title_name}${value.employee?.first_name} ${value.employee?.last_name}`,
			manager_name: `${value.manager?.title_name}${value.manager?.first_name} ${value.manager?.last_name}`,
			witness1_name: value.witness1 ? `${value.witness1?.title_name}${value.witness1?.first_name} ${value.witness1?.last_name}` : "-",
			witness2_name: value.witness2 ? `${value.witness2?.title_name}${value.witness2?.first_name} ${value.witness2?.last_name}` : "-",
			loaner2_name: `${value?.title_name}${value?.first_name} ${value?.last_name}`,
			village2_name: value?.village?.name || '',
			witness1_license: value.witness1 ? `${value.witness1?.title_name}${value.witness1?.first_name} ${value.witness1?.last_name}` : "-",
			witness2_license: value.witness2 ? `${value.witness2?.title_name}${value.witness2?.first_name} ${value.witness2?.last_name}` : "-",
			limit_hedgefund_protech: Helper.formatNumber(value.hedge_fund * 100),
			...address
		}
		console.log(value)
		for (const keyName in value) {
			if (!ignoreField.includes(keyName)) {
				if (coordinates[keyName]) {
					const text = value[keyName];
					const { x, y } = coordinates[keyName];
					currentPage.drawText(`${text}`, {
						x,
						y: currentPage.getHeight() - y,
						size: fontSize,
						color: rgb(0, 0, 0), // Black color
						font: embedFont
					});
				}
			}

		}
	})
	// remove last page
	pdfDoc.removePage(pdfDoc.getPageCount() - 1);

	const pdfBytes = await pdfDoc.save();
	const blob = new Blob([pdfBytes], { type: 'application/pdf' });
	return {
		export: () => saveAs(blob, file_name),
		data: pdfBytes,
		blobUrl: URL.createObjectURL(blob),
	}
};

export default readTemplatePDF;
