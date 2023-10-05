import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	promiseYear: null,
	promiseYearList: [],
};
const promiseYearSlice = createSlice({
	name: "promiseYear",
	initialState: initialState,
	reducers: {
		setPromiseYear: (state, action) => {
			state.promiseYear = action.payload;
		},
		setPromiseYearList: (state, action) => {
			state.promiseYearList = action.payload;
		},
	},
});

export const { setPromiseYear, setPromiseYearList } = promiseYearSlice.actions;
export default promiseYearSlice.reducer;