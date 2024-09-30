import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  selectedLanguage: {
    name: "English",
    code: "EN",
  },
  tax: null,
  isTaxLoading: false,
  taxError: null,
};

export const fetchTaxAmount = createAsyncThunk(
  "settings/fetchTaxAmount",
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/settings/fetch-tax`,
        {},
        config
      );
      if (response.data.success) return response.data.tax;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateTaxAmount = createAsyncThunk(
  "settings/updateTaxAmount",
  async (tax, { getState, rejectWithValue }) => {
    const { isAdmin, token } = getState().auth;
    if (!isAdmin || !token) return rejectWithValue("Unauthorized");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/settings/update-tax`,
        { tax },
        config
      );
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    changeLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxAmount.pending, (state) => {
        state.isTaxLoading = true;
        state.taxError = null;
      })
      .addCase(fetchTaxAmount.fulfilled, (state, action) => {
        state.isTaxLoading = false;
        state.taxError = null;
        state.tax = action.payload;
      })
      .addCase(fetchTaxAmount.rejected, (state, action) => {
        state.isTaxLoading = false;
        state.taxError = action.payload;
      })
      .addCase(updateTaxAmount.pending, (state) => {
        state.isTaxLoading = true;
        state.taxError = null;
      })
      .addCase(updateTaxAmount.fulfilled, (state) => {
        state.isTaxLoading = false;
        state.taxError = null;
      })
      .addCase(updateTaxAmount.rejected, (state, action) => {
        state.isTaxLoading = false;
        state.taxError = action.payload;
      });
  },
});

export const { changeLanguage } = settingsSlice.actions;

export default settingsSlice.reducer;
