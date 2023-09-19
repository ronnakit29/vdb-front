import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	toast: {
		visible: false,
		message: "",
		color: "",
		duration: 3000,
	},
	toastList: [],
};
const toastSlice = createSlice({
	name: "toast",
	initialState: initialState,
	reducers: {
		setToast: (state, action) => {
			state.toast = {
				...state.toast,
				...action.payload,
			};
		},
		setToastList: (state, action) => {
			state.toastList = action.payload;
		},
	},
});

export const { setToast, setToastList } = toastSlice.actions;
export default toastSlice.reducer;