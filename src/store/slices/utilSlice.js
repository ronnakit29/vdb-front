import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	util: null,
	utilList: [],
	dialog: {},
	title: {},
	toast: {
		isOpen: false,
		message: "",
		color: "",
		duration: 3000,
	},
	confirm: {
		isOpen: false,
		message: "",
		onConfirm: () => { },
	}
};
const utilSlice = createSlice({
	name: "util",
	initialState: initialState,
	reducers: {
		setUtil: (state, action) => {
			state.util = action.payload;
		},
		setUtilList: (state, action) => {
			state.utilList = action.payload;
		},
		setDialog: (state, action) => {
			state.dialog = {
				...state.dialog,
				...action.payload,
			}
		},
		setTitle: (state, action) => {
			state.title = {
				...state.title,
				...action.payload,
			}
		},
		setToast: (state, action) => {
			state.toast = {
				...state.toast,
				...action.payload,
			}
		},
		setConfirm: (state, action) => {
			state.confirm = {
				...state.confirm,
				...action.payload,
			}
		}
	},
});

export const { setUtil, setUtilList, setDialog, setTitle, setToast, setConfirm } = utilSlice.actions;
export default utilSlice.reducer;