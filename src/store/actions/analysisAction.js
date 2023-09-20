import { setAnalysis } from "../slices/analysisSlice";
import { client } from "../../classes/index";
import { showToast } from "./toastAction";
export function getAnalysis(village_code) {
	return async (dispatch) => {
		try {
			const response = await client.getAnalysis(village_code)
			dispatch(setAnalysis(response.data))
		} catch (error) {
			dispatch(showToast(error, "bg-red-500", 3000))
		}
	};
}