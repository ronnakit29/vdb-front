import moment from "moment";

class Helper {
	static formatNumber(number, digit = 2) {
		return Number(number).toFixed(digit).replace(/\d(?=(\d{3})+\.)/g, "$&,");
	}
	static pinValidator(pin, length) {
		// number only
		if (isNaN(pin)) {
			return false;
		}
		// length
		if (pin.length !== length) {
			return false;
		}
		return true;
	}
	static formatDate(date) {
		return moment(date).format("DD/MM/YYYY HH:mm:ss");
	}
	static thaiMonth(month) {
		const thaiMonth = [
			"มกราคม",
			"กุมภาพันธ์",
			"มีนาคม",
			"เมษายน",
			"พฤษภาคม",
			"มิถุนายน",
			"กรกฎาคม",
			"สิงหาคม",
			"กันยายน",
			"ตุลาคม",
			"พฤศจิกายน",
			"ธันวาคม",
		];
		return thaiMonth[month - 1];
	}
}

export default Helper;