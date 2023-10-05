import incomeExpensesSlice from "./incomeExpensesSlice";
import memberSlice from "./memberSlice";
import promiseDocumentSlice from "./promiseDocumentSlice";
import toastSlice from "./toastSlice";
import userSlice from "./userSlice";
import utilSlice from "./utilSlice";
import villageSlice from "./villageSlice";
import analysisSlice from "./analysisSlice";
import promiseYearSlice from "./promiseYearSlice";
const { combineReducers } = require("@reduxjs/toolkit");

const appReducer = combineReducers({
	util: utilSlice,
	member: memberSlice,
	toast: toastSlice,
	user: userSlice,
	promiseDocument: promiseDocumentSlice,
	incomeExpenses: incomeExpensesSlice,
	village: villageSlice,
	analysis: analysisSlice,
	promiseYear: promiseYearSlice
});

const rootReducer = (state, action) => {
	if(action.type === "RESET") {
		state = undefined;
	}
	return appReducer(state, action);
}

export default rootReducer;