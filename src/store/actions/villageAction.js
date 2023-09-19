import { client } from "@/classes";
import { showToast } from "./toastAction";
import { setVillageList } from "../slices/villageSlice";

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