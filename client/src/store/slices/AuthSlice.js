import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  isAdmin: false,
  token: null,
  loading: false,
  error: null,
};

const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      let response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/signup`,
        { name, email, password },
        config
      );
      return response.data;
    } catch (error) {
      if (error && error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      let response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        { email, password },
        config
      );
      return response.data;
    } catch (error) {
      if (error && error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const retrieveUser = createAsyncThunk(
  "auth/retrieve",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    if (!token) {
      return rejectWithValue("Token not found");
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      let response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/check-user-auth`,
        {},
        config
      );
      return response.data;
    } catch (error) {
      if (error && error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAdmin = false;
      state.token = null;
      state.loading = false;
      state.error = null;

      localStorage.clear("token");
      Cookies.remove("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAdmin = action.payload.user.isAdmin;

        localStorage.setItem("token", action.payload.token);
        Cookies.set("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAdmin = action.payload.isAdmin;

        localStorage.setItem("token", action.payload.token);
        Cookies.set("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(retrieveUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(retrieveUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.token = localStorage.getItem("token") || Cookies.get("token");
        state.user = action.payload.user;
        state.isAdmin = action.payload.isAdmin;
      })
      .addCase(retrieveUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export { registerUser, loginUser, retrieveUser };
export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;
