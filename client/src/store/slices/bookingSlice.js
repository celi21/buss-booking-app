import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  cities: [],
  userBookings: [],
  isCitiesLoading: false,
  isUserBookingsLoading: false,
  routes: [],
  isRoutesLoading: false,
  buses: [],
  isBusesLoading: false,
  adminBookings: [],
  isAdminBookingsLoading: false,
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
    // payment: {
    //   isCompleted: false,
    // },
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

export const fetchUserBookings = createAsyncThunk(
  "booking/fetchUserBookings",
  async (_, { getState, rejectWithValue }) => {
    const { user, token } = getState().auth;
    if (!user || !token) return rejectWithValue("Unauthorized");
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/user-bookings`,
        {},
        config
      );
      return response.data.bookings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAdminBookings = createAsyncThunk(
  "booking/fetchAdminBookings",
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
        `${process.env.REACT_APP_API_BASE_URL}/booking/fetch-admin-bookings`,
        {},
        config
      );
      return response.data.bookings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: initialState,
  reducers: {
    resetBusAvailabilityData: (state, action) => {
      state.busAvailabilityData = null;
      state.availableBus = null;
    },
    setCurrentBookingStep: (state, action) => {
      state.currentBookingStep = action.payload;
    },
    updateBookingStepStatus: (state, action) => {
      const { step, isCompleted = false } = action.payload;
      if (state.bookingStepsStatus[step]) {
        state.bookingStepsStatus[step].isCompleted = isCompleted;
      }
    },
    resetBookingForm: (state) => {
      Object.assign(state, initialState);
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
      })
      .addCase(fetchUserBookings.pending, (state) => {
        state.isUserBookingsLoading = true;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.isUserBookingsLoading = false;
        state.userBookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.isUserBookingsLoading = false;
      })
      .addCase(fetchAdminBookings.pending, (state) => {
        state.isAdminBookingsLoading = true;
      })
      .addCase(fetchAdminBookings.fulfilled, (state, action) => {
        state.isAdminBookingsLoading = false;
        state.adminBookings = action.payload;
      })
      .addCase(fetchAdminBookings.rejected, (state, action) => {
        state.isAdminBookingsLoading = false;
        state.adminBookings = [];
      });
  },
});

export const {
  setCurrentBookingStep,
  updateBookingStepStatus,
  resetBookingForm,
  resetBusAvailabilityData,
} = bookingSlice.actions;

export default bookingSlice.reducer;
