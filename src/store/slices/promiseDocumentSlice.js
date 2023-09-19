import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	promiseDocument: null,
	promiseDocumentList: [],
	analysisReport: {
		count: 0,
		sum: 0,
		hedge_fund: 0,
	},
	memberDocs: [],
};
const promiseDocumentSlice = createSlice({
	name: "promiseDocument",
	initialState: initialState,
	reducers: {
		setPromiseDocument: (state, action) => {
			state.promiseDocument = action.payload;
		},
		setPromiseDocumentList: (state, action) => {
			state.promiseDocumentList = action.payload;
		},
		setAnalysisReport: (state, action) => {
			state.analysisReport = action.payload;
		},
		setMemberDocs: (state, action) => {
			state.memberDocs = action.payload;
		}
	},
});

export const { setPromiseDocument, setPromiseDocumentList, setAnalysisReport, setMemberDocs } = promiseDocumentSlice.actions;
export default promiseDocumentSlice.reducer;