import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  busTypes: [],
  isLoading: false,
  isNewBusTypeLoading: false,
  newBusTypeError: null,
};

export const fetchBusTypes = createAsyncThunk(
  "bus/fetchBusTypes",
  async (_, { getState, rejectWithValue }) => {
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
        `${process.env.REACT_APP_API_BASE_URL}/bus/fetch-bus-types`,
        {},
        config
      );
      return response.data.busTypes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewBusType = createAsyncThunk(
  "bus/addNewBusType",
  async (newBusType, { getState, rejectWithValue }) => {
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
        `${process.env.REACT_APP_API_BASE_URL}/bus/add-bus-type`,
        newBusType,
        config
      );
      if (response.data.success) return response.data.busType;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const removeBusTypeItem = createAsyncThunk(
  "bus/removeBusType",
  async (busTypeId, { getState, rejectWithValue }) => {
    const { isAdmin, token } = getState().auth;
    if (!isAdmin || !token) return rejectWithValue("Unauthorized");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          busTypeId,
        },
      };
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/bus/remove-bus-type`,
        config
      );
      return response.data.success;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBusTypeStatus = createAsyncThunk(
  "bus/updateBusTypeStatus",
  async ({ busTypeId, status }, { getState, rejectWithValue }) => {
    const { isAdmin, token } = getState().auth;
    if (!isAdmin || !token) return rejectWithValue("Unauthorized");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/bus/update-bus-type-status`,
        { busTypeId, status },
        config
      );
      return response.data.success;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const busTypeSlice = createSlice({
  name: "busType",
  initialState,
  reducers: {
    clearNewBusTypeError: (state) => {
      state.newBusTypeError = null;
    },
    setNewBusTypeError: (state, action) => {
      state.newBusTypeError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusTypes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBusTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.busTypes = action.payload;
      })
      .addCase(fetchBusTypes.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewBusType.pending, (state) => {
        state.isNewBusTypeLoading = true;
      })
      .addCase(addNewBusType.fulfilled, (state, action) => {
        state.isNewBusTypeLoading = false;
        if (action.payload) {
          state.busTypes.push(action.payload);
        }
      })
      .addCase(addNewBusType.rejected, (state, action) => {
        state.isNewBusTypeLoading = false;
        state.newBusTypeError = action.payload;
      })
      .addCase(removeBusTypeItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeBusTypeItem.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.busTypes = state.busTypes.filter(
            (busType) => busType._id !== action.meta.arg
          );
        }
      })
      .addCase(removeBusTypeItem.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateBusTypeStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBusTypeStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const busType = state.busTypes.find(
            (busType) => busType._id === action.meta.arg.busTypeId
          );
          busType.status = action.meta.arg.status;
        }
      })
      .addCase(updateBusTypeStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearNewBusTypeError, setNewBusTypeError } =
  busTypeSlice.actions;
export default busTypeSlice.reducer;
