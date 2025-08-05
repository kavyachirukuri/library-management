import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StatusCode from "../utils/statusCode";

const initialState = {
  data: [],
  status: StatusCode.IDLE,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    markAsUnavailable(state, action) {
      const bookId = action.payload;
      const book = state.data.find((b) => b.id === bookId);
      if (book) {
        book.available = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBooks.pending, (state) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = StatusCode.IDLE;
      })
      .addCase(getBooks.rejected, (state) => {
        state.status = StatusCode.ERROR;
      });
  },
});

export const { markAsUnavailable } = booksSlice.actions;
export default booksSlice.reducer;

export const getBooks = createAsyncThunk("books/get", async () => {
  const res = await fetch("https://www.dbooks.org/api/recent");
  console.log("res", res);
  const data = await res.json();
  const booksWithAvailability = data.books.map((book) => ({
    ...book,
    available: true,
  }));

  return booksWithAvailability;
});
