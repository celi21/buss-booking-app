import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  cities: [],
  isCitiesLoading: false,
  routes: [],
  isRoutesLoading: false,
  buses: [],
  isBusesLoading: false,
  isBusAvailableLoading: false,
  busAvailabilityData: null,
  availableBus: null,
  availableBusError: null,
  currentBookingStep: "dates-and-locations",
  bookingStepsStatus: {
    "dates-and-locations": {
      isCompleted: false,
    },
    tickets: {
      isCompleted: false,
    },
    details: {
      isCompleted: false,
    },
    confirm: {
      isCompleted: false,
    },
    payment: {
      isCompleted: false,
    },
  },
};

export const fetchCities = createAsyncThunk(
  "booking/fetchCities",
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/fetch-cities`,
        {},
        config
      );
      return response.data.cities;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkIfBusAvailable = createAsyncThunk(
  "booking/checkIfBusAvailable",
  async (queryObject, { getState, rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/check-bus-availability`,
        queryObject,
        config
      );
      if (
        response.data &&
        response.data.success &&
        response.data.success == true
      ) {
        return {
          bus: response.data.bus,
          busAvailabilityData: response.data.busAvailability,
        };
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: initialState,
  reducers: {
    setCurrentBookingStep: (state, action) => {
      state.currentBookingStep = action.payload;
    },
    updateBookingStepStatus: (state, action) => {
      const { step, isCompleted = false } = action.payload;
      if (state.bookingStepsStatus[step]) {
        state.bookingStepsStatus[step].isCompleted = isCompleted;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.isCitiesLoading = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.isCitiesLoading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.isCitiesLoading = false;
      })
      .addCase(checkIfBusAvailable.pending, (state) => {
        state.isBusAvailableLoading = true;
        state.availableBusError = null;
      })
      .addCase(checkIfBusAvailable.fulfilled, (state, action) => {
        state.isBusAvailableLoading = false;
        state.availableBus = action.payload.bus;
        state.busAvailabilityData = action.payload.busAvailabilityData;
        state.availableBusError = null;
      })
      .addCase(checkIfBusAvailable.rejected, (state, action) => {
        state.isBusAvailableLoading = false;
        state.availableBusError = action.payload;
        state.availableBus = null;
      });
  },
});

export const { setCurrentBookingStep, updateBookingStepStatus } =
  bookingSlice.actions;

export default bookingSlice.reducer;
