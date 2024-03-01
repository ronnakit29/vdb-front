import { client } from "@/classes";
import { showToast } from "./toastAction";
import { setSecurities } from "../slices/securitiesSlice";

export function getSecuritiesByGroupId(promiseGroupId) {
    return async (dispatch) => {
        try {
            const response = await client.getSecuritiesByGroupId(promiseGroupId);
            console.log(response)
            dispatch(setSecurities(response.data))
        } catch (error) {
            dispatch(showToast(error?.response?.data?.error || error?.message || error || 'เกิดข้อผิดพลาด'))
        }
    }
}