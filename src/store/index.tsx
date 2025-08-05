import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import booksSlice from "./booksSlice";
import wishListSlice from "./wishListSlice";
import myRentalsSlice from "./myRentalsSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    books: booksSlice,
    wishList: wishListSlice,
    myRentals: myRentalsSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
