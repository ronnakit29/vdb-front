import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	analysis: {},
	analysisList: [],
};
const analysisSlice = createSlice({
	name: "analysis",
	initialState: initialState,
	reducers: {
		setAnalysis: (state, action) => {
			state.analysis = action.payload;
		},
		setAnalysisList: (state, action) => {
			state.analysisList = action.payload;
		},
	},
});

export const { setAnalysis, setAnalysisList } = analysisSlice.actions;
export default analysisSlice.reducer;