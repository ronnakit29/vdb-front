import { client } from "@/classes";
import { showToast } from "./toastAction";
import { setVillage, setVillageList } from "../slices/villageSlice";

export function getVillageList() {
	return async (dispatch) => {
		try {
			const response = await client.getVillageList()
			dispatch(setVillageList(response.data))
		} catch (error) {
			dispatch(showToast(error, "bg-red-500", 3000))
		}
	};
}
export function createVillage(data) {
	return async (dispatch) => {
		try {
			const response = await client.createVillage(data)
			dispatch(getVillageList())
			dispatch(showToast("สร้างสำเร็จแล้ว", "bg-green-500", 3000))
		} catch (error) {
			dispatch(showToast(error, "bg-red-500", 3000))
		}
	};
}
export function updateVillage(data) {
	return async (dispatch) => {
		try {
			const response = await client.updateVillage(data)
			dispatch(getVillageList())
			dispatch(showToast("แก้ไขสำเร็จแล้ว", "bg-green-500", 3000))
		} catch (error) {
			dispatch(showToast(error, "bg-red-500", 3000))
		}
	};
}
export function deleteVillage(id) {
	return async (dispatch) => {
		try {
			const response = await client.deleteVillage(id)
			dispatch(getVillageList())
			dispatch(showToast("ลบสำเร็จแล้ว", "bg-green-500", 3000))
		} catch (error) {
			dispatch(showToast(error, "bg-red-500", 3000))
		}
	};
}
export function getVillage(id) {
	return async (dispatch) => {
		try {
			const response = await client.getVillage(id)
			dispatch(setVillage(response.data))
		} catch (error) {
			dispatch(showToast(error, "bg-red-500", 3000))
		}
	};
}