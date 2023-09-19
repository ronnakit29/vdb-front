import { client } from "@/classes";
import { setCount, setInsertSlot, setMemberList } from "../slices/memberSlice";
import { showToast } from "./toastAction";

export function getMemberFromCard(insertSlot, callback) {
	return async (dispatch) => {
		try {
			const { data } = await client.getMemberFromCard();
			if (data) {
				dispatch(setInsertSlot({
					[insertSlot]: data
				}))
				if (callback) {
					callback(data);
				}
			}
		} catch (error) {
			console.log(error)
		}
	}
}

export function getMemberList() {
	return async (dispatch) => {
		try {
			const response = await client.getMemberList();
			dispatch(setMemberList(response.data))
			dispatch(setCount(response.count))
		} catch (error) {
			dispatch(showToast({ message: error.message, color: "error" }));
		}
	}
}