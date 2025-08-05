import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const wishListSlice = createSlice({
  name: "wishList",
  initialState,
  reducers: {
    addFav(state, action) {
      state.push(action.payload);
    },
    removeFav(state, action) {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addFav, removeFav } = wishListSlice.actions;
export default wishListSlice.reducer;
