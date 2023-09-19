import { client } from "@/classes";
import { setIncomeExpensesList } from "../slices/incomeExpensesSlice";
import { showToast } from "./toastAction";

export function getIncomeExpenseList(vid) {
	return async (dispatch) => {
		try {
			const response = await client.getIncomeExpenseList(vid)
			dispatch(setIncomeExpensesList(response.data))
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
			dispatch(showToast(error, "bg-red-500", 3000))
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