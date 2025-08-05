import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  penalty?: number;
  clearedAt?: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type UserState = {
  loading: boolean;
  user: User | null;
  error: string | null;
};

export const loginUser = createAsyncThunk<User, LoginCredentials>(
  "user/loginUser",
  async (userCredentials) => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    const users: User[] = response.data;

    const matchedUser = users.find(
      (user) => user.email === userCredentials.email
    );

    if (matchedUser) {
      const fakeUser: User = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        avatar: "",
        penalty: 0,
      };

      localStorage.setItem("user", JSON.stringify(fakeUser));
      return fakeUser;
    } else {
      throw new Error("Invalid Credentials");
    }
  }
);

const initialState: UserState = {
  loading: false,
  user: JSON.parse(localStorage.getItem("user") || "null"),
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    setPenalty: (state, action) => {
      console.log("action", action);
      if (state.user) {
        state.user.penalty = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    clearPenalty: (state) => {
      if (state.user) {
        state.user.penalty = 0;
        state.user.clearedAt = new Date().toISOString();
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        if (action.error.message === "Request failed with status code 401") {
          state.error = "Access Denied! Invalid Credentials";
        } else {
          state.error =
            (action.payload as string) ||
            action.error.message ||
            "Login failed";
        }
      });
  },
});

export const { updateProfile, setPenalty, logoutUser } = userSlice.actions;
export default userSlice.reducer;
