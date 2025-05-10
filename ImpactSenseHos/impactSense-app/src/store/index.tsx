import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Create a slice for shared text
const sharedTextSlice = createSlice({
  name: "sharedText",
  initialState: "",
  reducers: {
    setSharedText: (state, action: PayloadAction<string>) => action.payload,
  },
});

export const { setSharedText } = sharedTextSlice.actions;

const store = configureStore({
  reducer: {
    sharedText: sharedTextSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
