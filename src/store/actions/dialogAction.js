import { setDialog, setTitle } from "../slices/utilSlice"

export function showDialog(dialogName, title) {
	return dispatch => {
		dispatch(setDialog({
			[dialogName]: true,
		}))
		dispatch(setTitle({
			[dialogName]: title,
		}))
	}
}

export function hideDialog(dialogName) {
	return dispatch => {
		dispatch(setDialog({
			[dialogName]: false,
		}))
		dispatch(setTitle({
			[dialogName]: "",
		}))
	}
}