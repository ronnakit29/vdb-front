import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	incomeExpenses: null,
	incomeExpensesList: [],
};
const incomeExpensesSlice = createSlice({
	name: "incomeExpenses",
	initialState: initialState,
	reducers: {
		setIncomeExpenses: (state, action) => {
			state.incomeExpenses = action.payload;
		},
		setIncomeExpensesList: (state, action) => {
			state.incomeExpensesList = action.payload;
		},
	},
});

export const { setIncomeExpenses, setIncomeExpensesList } = incomeExpensesSlice.actions;
export default incomeExpensesSlice.reducer;