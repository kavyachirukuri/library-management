import { createSlice } from "@reduxjs/toolkit";

type Book = {
  id: string;
  title: string;
  image: string;
  rentedAt: string;
  dueAt: string;
  rentedBy: string;
};

const loadFromStorage = (): Book[] => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const allRentals: Book[] = JSON.parse(
      localStorage.getItem("rentals") || "[]"
    );

    if (!user) return [];

    return allRentals.filter((rental) => rental.rentedBy === user.name);
  } catch (e) {
    console.error("Failed to load rentals:", e);
    return [];
  }
};

const initialState: Book[] = loadFromStorage();

const myRentalsSlice = createSlice({
  name: "myRentals",
  initialState,
  reducers: {
    addRentals(state, action) {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user) return;

        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        const currentPenalty = storedUser?.penalty || 0;

        if (currentPenalty > 50) {
          alert("Cannot rent new books. Clear your penalties first.");
          return;
        }

        const book = action.payload;
        const now = new Date();
        const due = new Date(now.getTime() + 1 * 60 * 1000); // 1 minute from now
        const rentalEntry = {
          ...book,
          rentedAt: now.toISOString(),
          dueAt: due.toISOString(),
          rentedBy: user.name,
        };

        state.push(rentalEntry);

        const allRentals: Book[] = JSON.parse(
          localStorage.getItem("rentals") || "[]"
        );
        const updatedRentals = [...allRentals, rentalEntry];

        localStorage.setItem("rentals", JSON.stringify(updatedRentals));
      } catch (e) {
        console.error("Failed to add rental:", e);
      }
    },

    removeRentals(state, action) {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user) return state;

        const bookIdToRemove = action.payload;

        const allRentals: Book[] = JSON.parse(
          localStorage.getItem("rentals") || "[]"
        );

        const updatedAllRentals = allRentals.filter(
          (book) => !(book.id === bookIdToRemove && book.rentedBy === user.name)
        );

        localStorage.setItem("rentals", JSON.stringify(updatedAllRentals));

        const updatedUserRentals = state.filter(
          (book) => book.id !== bookIdToRemove
        );

        return updatedUserRentals;
      } catch (e) {
        console.error("Failed to remove rental:", e);
        return state;
      }
    },
    removeMultipleRentals(state, action) {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user) return state;

        const idsToRemove: string[] = action.payload;

        const allRentals: Book[] = JSON.parse(
          localStorage.getItem("rentals") || "[]"
        );

        const updatedAllRentals = allRentals.filter(
          (book) =>
            !(idsToRemove.includes(book.id) && book.rentedBy === user.name)
        );

        localStorage.setItem("rentals", JSON.stringify(updatedAllRentals));

        return state.filter((book) => !idsToRemove.includes(book.id));
      } catch (e) {
        console.error("Failed to remove multiple rentals:", e);
        return state;
      }
    },
    syncRentals(state) {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const allRentals: Book[] = JSON.parse(
        localStorage.getItem("rentals") || "[]"
      );
      if (!user) return [];
      return allRentals.filter((rental) => rental.rentedBy === user.name);
    },
  },
});

export const { addRentals, removeRentals, removeMultipleRentals, syncRentals } =
  myRentalsSlice.actions;
export default myRentalsSlice.reducer;
