import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  cities: [],
  routes: [],
  isCitiesLoading: false,
  isRoutesLoading: false,
  isNewCityLoading: false,
  isNewRouteLoading: false,
  newCityError: null,
  newRouteError: null,
  editCityObject: null,
  editRouteObject: null,
  editCityError: null,
  editRouteError: null,
  isEditCityLoading: false,
  isEditRouteLoading: false,
};

export const addNewCity = createAsyncThunk(
  "bus/addNewCity",
  async (newCity, { getState, rejectWithValue }) => {
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
        `${process.env.REACT_APP_API_BASE_URL}/routes/add-city`,
        newCity,
        config
      );
      if (response.data.success) return response.data.city;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const fetchCities = createAsyncThunk(
  "bus/fetchCities",
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
        `${process.env.REACT_APP_API_BASE_URL}/routes/fetch-cities`,
        {},
        config
      );
      return response.data.cities;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const RoutesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    setNewCityError: (state, action) => {
      state.newCityError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewCity.pending, (state) => {
        state.isNewCityLoading = true;
        state.newCityError = null;
      })
      .addCase(addNewCity.fulfilled, (state, action) => {
        state.isNewCityLoading = false;
        state.cities.push(action.payload);
      })
      .addCase(addNewCity.rejected, (state, action) => {
        state.isNewCityLoading = false;
        state.newCityError = action.payload;
      })
      .addCase(fetchCities.pending, (state) => {
        state.isCitiesLoading = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.isCitiesLoading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.isCitiesLoading = false;
      });
  },
});

export const { setNewCityError } = RoutesSlice.actions;

export default RoutesSlice.reducer;
