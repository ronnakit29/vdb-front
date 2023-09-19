import { client } from "@/classes";
import { setUserList } from "../slices/userSlice";
import { showToast } from "./toastAction";

export function getUserList(village_code) {
	return async (dispatch) => {
		try {
			const response = await client.getUserList(village_code)
			dispatch(setUserList(response.data))
		} catch (error) {
			dispatch(showToast(error, "bg-red-500", 3000))
		}
	};
}

export function createUser(data, successCallback) {
	return async (dispatch) => {
		try {
			const response = await client.createUser(data)
			dispatch(showToast("บันทึกข้อมูลสำเร็จ", "bg-green-500", 3000))
			successCallback && successCallback(response)
		} catch (error) {
			dispatch(showToast(error, "bg-red-500", 3000))
		}
	};
}