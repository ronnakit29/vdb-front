import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	village: null,
	villageList: [],
};
const villageSlice = createSlice({
	name: "village",
	initialState: initialState,
	reducers: {
		setVillage: (state, action) => {
			state.village = action.payload;
		},
		setVillageList: (state, action) => {
			state.villageList = action.payload;
		},
	},
});

export const { setVillage, setVillageList } = villageSlice.actions;
export default villageSlice.reducer;