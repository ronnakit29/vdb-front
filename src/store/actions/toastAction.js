import { setToast } from "../slices/toastSlice";

export const showToast = (message, color, duration) => {
		return (dispatch) => {
				dispatch(setToast({ visible: true, message, color, duration }));
		};
}

export const hideToast = () => {
		return (dispatch) => {
				dispatch(setToast({ visible: false }));
		};
}