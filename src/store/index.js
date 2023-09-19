import rootReducer from "./slices/rootSlice";

const { configureStore } = require("@reduxjs/toolkit");

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		serializableCheck: false,
	}),
})

export default store;