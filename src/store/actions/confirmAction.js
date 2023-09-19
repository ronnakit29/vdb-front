import { setConfirm } from "../slices/utilSlice"

export function showConfirm(message, onConfirm) {
		return (dispatch) => {
				dispatch(setConfirm({
						isOpen: true,
						message: message,
						onConfirm: onConfirm,
				}))
		}
}

export function closeConfirm() {
		return (dispatch) => {
				dispatch(setConfirm({
						isOpen: false,
						message: "",
						onConfirm: () => { },
				}))
		}
}