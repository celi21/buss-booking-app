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
  "routes/addNewCity",
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
  "routes/fetchCities",
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

export const updateCityStatus = createAsyncThunk(
  "routes/updateCityStatus",
  async ({ cityId, status }, { getState, rejectWithValue }) => {
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
        `${process.env.REACT_APP_API_BASE_URL}/routes/update-city-status`,
        { cityId, status },
        config
      );
      return response.data.success;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCityItem = createAsyncThunk(
  "routes/removeCity",
  async (cityId, { getState, rejectWithValue }) => {
    const { isAdmin, token } = getState().auth;
    if (!isAdmin || !token) return rejectWithValue("Unauthorized");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          cityId,
        },
      };
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/routes/remove-city`,
        config
      );
      return response.data.success;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editCityItem = createAsyncThunk(
  "routes/editCityItem",
  async (city, { getState, rejectWithValue }) => {
    const { isAdmin, token } = getState().auth;
    if (!isAdmin || !token) return rejectWithValue("Unauthorized");
    if (!city) return rejectWithValue("Invalid bus type data");
    if (!city._id) return rejectWithValue("Invalid bus type id");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/routes/update-city`,
        city,
        config
      );
      return response.data.city;
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
    setEditCityObject: (state, action) => {
      state.editCityObject = action.payload;
    },
    setEditCityError: (state, action) => {
      state.editCityError = action.payload;
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
      })
      .addCase(updateCityStatus.pending, (state) => {
        state.isEditCityLoading = true;
        state.editCityError = null;
        state.isCitiesLoading = true;
      })
      .addCase(updateCityStatus.fulfilled, (state, action) => {
        state.isEditCityLoading = false;
        state.isCitiesLoading = false;
        if (action.payload) {
          const city = state.cities.find(
            (city) => city._id === action.meta.arg.cityId
          );
          city.status = action.meta.arg.status;
        }
      })
      .addCase(updateCityStatus.rejected, (state, action) => {
        state.isEditCityLoading = false;
        state.editCityError = action.payload;
        state.isCitiesLoading = false;
      })
      .addCase(removeCityItem.pending, (state) => {
        state.isCitiesLoading = true;
      })
      .addCase(removeCityItem.fulfilled, (state, action) => {
        state.isCitiesLoading = false;
        if (action.payload) {
          state.cities = state.cities.filter(
            (city) => city._id !== action.meta.arg
          );
        }
      })
      .addCase(removeCityItem.rejected, (state) => {
        state.isCitiesLoading = false;
      })
      .addCase(editCityItem.pending, (state) => {
        state.isEditCityLoading = true;
        state.editCityError = null;
        state.isCitiesLoading = true;
      })
      .addCase(editCityItem.fulfilled, (state, action) => {
        state.isEditCityLoading = false;
        if (action.payload) {
          const index = state.cities.findIndex(
            (city) => city._id === action.payload._id
          );
          state.cities[index] = action.payload;
        }
        state.isCitiesLoading = false;
      })
      .addCase(editCityItem.rejected, (state, action) => {
        state.isEditCityLoading = false;
        state.editCityError = action.payload;
        state.isCitiesLoading = false;
      });
  },
});

export const { setNewCityError, setEditCityObject, setEditCityError } =
  RoutesSlice.actions;

export default RoutesSlice.reducer;
