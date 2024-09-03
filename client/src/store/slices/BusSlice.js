import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  buses: [],
  isBusesLoading: false,
  addNewBusLoading: false,
  addNewBusError: null,
  editNewBusLoading: false,
  editNewBusError: null,
  fetchBusObject: null,
  fetchBusError: null,
  fetchBusLoading: false,
  editBusLoading: false,
  editBusError: null,
};

export const addNewBus = createAsyncThunk(
  "bus/addNewBus",
  async (busObject, { getState, rejectWithValue }) => {
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
        `${process.env.REACT_APP_API_BASE_URL}/bus/add-new-bus`,
        busObject,
        config
      );
      if (response.data.success) return response.data.busObject;
    } catch (error) {
      if (error && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const fetchBuses = createAsyncThunk(
  "bus/fetchBuses",
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
        `${process.env.REACT_APP_API_BASE_URL}/bus/fetch-buses`,
        {},
        config
      );
      if (response.data.success) return response.data.buses;
    } catch (error) {
      if (error && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const fetchBusById = createAsyncThunk(
  "bus/fetchBusById",
  async (busId, { getState, rejectWithValue }) => {
    const { isAdmin, token } = getState().auth;
    if (!isAdmin || !token) return rejectWithValue("Unauthorized");
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/bus/fetch-bus/${busId}`,
        config
      );
      if (response.data.success) return response.data.bus;
    } catch (error) {
      if (error && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const editBus = createAsyncThunk(
  "bus/editBus",
  async (busObject, { getState, rejectWithValue }) => {
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
        `${process.env.REACT_APP_API_BASE_URL}/bus/edit-bus`,
        busObject,
        config
      );
      if (response.data.success) return response.data.busObject;
    } catch (error) {
      if (error && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const BusSlice = createSlice({
  name: "bus",
  initialState,
  reducers: {
    setAddNewBusError: (state, action) => {
      state.addNewBusError = action.payload;
    },
    setEditBusError: (state, action) => {
      state.editBusError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewBus.pending, (state) => {
        state.addNewBusLoading = true;
        state.addNewBusError = null;
        state.isBusesLoading = true;
      })
      .addCase(addNewBus.fulfilled, (state, action) => {
        state.addNewBusLoading = false;
        state.isBusesLoading = false;
        state.buses.push(action.payload);
      })
      .addCase(addNewBus.rejected, (state, action) => {
        state.addNewBusLoading = false;
        state.isBusesLoading = false;
        state.addNewBusError = action.payload;
      })
      .addCase(fetchBuses.pending, (state) => {
        state.isBusesLoading = true;
      })
      .addCase(fetchBuses.fulfilled, (state, action) => {
        state.buses = action.payload;
        state.isBusesLoading = false;
      })
      .addCase(fetchBuses.rejected, (state, action) => {
        state.isBusesLoading = false;
      })
      .addCase(fetchBusById.pending, (state) => {
        state.fetchBusError = null;
        state.fetchBusLoading = true;
      })
      .addCase(fetchBusById.fulfilled, (state, action) => {
        state.fetchBusError = null;
        state.fetchBusLoading = false;
        state.fetchBusObject = action.payload;
      })
      .addCase(fetchBusById.rejected, (state, action) => {
        state.fetchBusError = action.payload;
        state.fetchBusLoading = false;
        state.fetchBusObject = null;
      })
      .addCase(editBus.pending, (state) => {
        state.editBusLoading = true;
        state.editBusError = null;
        state.fetchBusLoading = true;
      })
      .addCase(editBus.fulfilled, (state, action) => {
        state.editBusLoading = false;
        state.editNewBusError = null;
        state.fetchBusLoading = false;
        state.fetchBusObject = action.payload;
      })
      .addCase(editBus.rejected, (state, action) => {
        state.editBusError = null;
        state.fetchBusLoading = false;
        state.editBusLoading = false;
      });
  },
});

export const { setAddNewBusError, setEditBusError } = BusSlice.actions;

export default BusSlice.reducer;
