import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	member: null,
	memberList: [],
	count: 0,
	insertSlot: {
		member: null,
		guarantorFirst: null,
		guarantorSecond: null,
		manager: null,
		employee: null,
	},
	insertSlotType: null,
};
const memberSlice = createSlice({
	name: "member",
	initialState: initialState,
	reducers: {
		setMember: (state, action) => {
			state.member = action.payload;
		},
		setMemberList: (state, action) => {
			state.memberList = action.payload;
		},
		setInsertSlot: (state, action) => {
			state.insertSlot = {
				...state.insertSlot,
				...action.payload,
			}
		},
		setCount: (state, action) => {
			state.count = action.payload;
		},
		setInsertSlotType: (state, action) => {
			state.insertSlotType = action.payload;
		}
	},
});

export const { setMember, setMemberList, setInsertSlot, setInsertSlotType, setCount } = memberSlice.actions;
export default memberSlice.reducer;