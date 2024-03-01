import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    securities: null,
    securitiesList: [],
};
const securitiesSlice = createSlice({
    name: "securities",
    initialState: initialState,
    reducers: {
        setSecurities: (state, action) => {
            state.securities = action.payload;
        },
        setSecuritiesList: (state, action) => {
            state.securitiesList = action.payload;
        },
    },
});

export const { setSecurities, setSecuritiesList } = securitiesSlice.actions;
export default securitiesSlice.reducer;