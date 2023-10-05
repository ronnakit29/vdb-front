import { client } from "@/classes";
import { setPromiseYear } from "../slices/promiseYearSlice";
import { showToast } from "./toastAction";

export function getPromiseYear() {
		return async (dispatch) => {
				try {
						const response = await client.getPromiseYear()
						dispatch(setPromiseYear(response.data))
				} catch (error) {
						dispatch(showToast(error, "bg-red-500", 3000))
				}
		};
}

export function updatePromiseYear(year) {
		return async (dispatch) => {
				try {
						const response = await client.updatePromiseYear(year)
						dispatch(showToast("บันทึกข้อมูลสำเร็จ", "bg-green-500", 3000))
				} catch (error) {
						dispatch(showToast(error, "bg-red-500", 3000))
				}
		};
}