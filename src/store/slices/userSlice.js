import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: null,
	userList: [],
};
const userSlice = createSlice({
	name: "user",
	initialState: initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setUserList: (state, action) => {
			state.userList = action.payload;
		},
	},
});

export const { setUser, setUserList } = userSlice.actions;
export default userSlice.reducer;