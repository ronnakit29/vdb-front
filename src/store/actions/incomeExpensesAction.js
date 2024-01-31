import { client } from "@/classes";
import { setIncomeExpenses, setIncomeExpensesList } from "../slices/incomeExpensesSlice";
import { showToast } from "./toastAction";

export function getIncomeExpenseList(vid, startDate, endDate) {
	return async (dispatch) => {
		try {
			const response = await client.getIncomeExpenseList(vid, startDate, endDate)
			dispatch(setIncomeExpensesList(response.data))
		} catch (error) {
			dispatch(showToast(error, "bg-red-500", 3000))
		}
	};
}
export function handleCancelIncomeExpense(id, successCallback) {
	return async (dispatch) => {
		try {
			const response = await client.handleCancelIncomeExpense(id)
			if (response) {
				successCallback && successCallback(response)
				dispatch(showToast("ยกเลิกข้อมูลสำเร็จ", "bg-green-500", 3000))
			}
		} catch (error) {
			dispatch(showToast(error, "bg-red-500", 3000))
		}
	};
}

export function getIncomeExpenseById(id) {
	return async (dispatch) => {
		try {
			const response = await client.getIncomeExpenseById(id)
			dispatch(setIncomeExpenses(response.data))
		} catch (error) {
			dispatch(showToast(error, "bg-red-500", 3000))
		}
	};
}

export function createIncomeExpenses(data, successCallback) {
	return async (dispatch) => {
		try {
			const response = await client.createIncomeExpenses(data)
			if (response) {
				successCallback && successCallback(response)
				dispatch(showToast("บันทึกข้อมูลสำเร็จ", "bg-green-500", 3000))
			}
		} catch (error) {
			dispatch(showToast(error, "bg-red-500", 7000))
		}
	};
}

export function deleteIncomeExpenses(data, successCallback) {
	return async (dispatch) => {
		try {
			const response = await client.deleteIncomeExpenses(data)
			successCallback && successCallback(response)
			dispatch(showToast("ลบข้อมูลสำเร็จ", "bg-green-500", 3000))
		} catch (error) {
			dispatch(showToast(error, "bg-red-500", 3000))
		}
	};
}