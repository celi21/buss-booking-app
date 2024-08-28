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

export const addNewRoute = createAsyncThunk(
  "routes/addNewRoute",
  async (newRoute, { getState, rejectWithValue }) => {
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
        `${process.env.REACT_APP_API_BASE_URL}/routes/add-route`,
        newRoute,
        config
      );
      if (response.data.success) return response.data.route;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const fetchRoutes = createAsyncThunk(
  "routes/fetchRoutes",
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
        `${process.env.REACT_APP_API_BASE_URL}/routes/fetch-routes`,
        {},
        config
      );
      return response.data.routes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editRouteItem = createAsyncThunk(
  "routes/editRouteItem",
  async (route, { getState, rejectWithValue }) => {
    const { isAdmin, token } = getState().auth;
    if (!isAdmin || !token) return rejectWithValue("Unauthorized");
    if (!route) return rejectWithValue("Invalid route data");
    if (!route._id) return rejectWithValue("Invalid route id");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/routes/update-route`,
        route,
        config
      );
      return response.data.route;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeRouteItem = createAsyncThunk(
  "routes/removeRoute",
  async (routeId, { getState, rejectWithValue }) => {
    const { isAdmin, token } = getState().auth;
    if (!isAdmin || !token) return rejectWithValue("Unauthorized");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          routeId,
        },
      };
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/routes/remove-route`,
        config
      );
      return response.data.success;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRouteStatus = createAsyncThunk(
  "routes/updateRouteStatus",
  async ({ id, status }, { getState, rejectWithValue }) => {
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
        `${process.env.REACT_APP_API_BASE_URL}/routes/update-route-status`,
        { id, status },
        config
      );
      return response.data.success;
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
    setNewRouteError: (state, action) => {
      state.newRouteError = action.payload;
    },
    setEditRouteObject: (state, action) => {
      state.editRouteObject = action.payload;
    },
    setEditRouteError: (state, action) => {
      state.editRouteError = action.payload;
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
      })
      .addCase(addNewRoute.pending, (state) => {
        state.isNewRouteLoading = true;
        state.isRoutesLoading = true;
        state.newRouteError = null;
      })
      .addCase(addNewRoute.fulfilled, (state, action) => {
        state.isNewRouteLoading = false;
        state.isRoutesLoading = false;
        state.routes.push(action.payload);
      })
      .addCase(addNewRoute.rejected, (state, action) => {
        state.isNewRouteLoading = false;
        state.isRoutesLoading = false;
        state.newRouteError = action.payload;
      })
      .addCase(fetchRoutes.pending, (state) => {
        state.isRoutesLoading = true;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.isRoutesLoading = false;
        state.routes = action.payload;
      })
      .addCase(fetchRoutes.rejected, (state) => {
        state.isRoutesLoading = false;
      })
      .addCase(removeRouteItem.pending, (state) => {
        state.isRoutesLoading = true;
      })
      .addCase(removeRouteItem.fulfilled, (state, action) => {
        state.isRoutesLoading = false;
        if (action.payload) {
          state.routes = state.routes.filter(
            (route) => route._id !== action.meta.arg
          );
        }
      })
      .addCase(removeRouteItem.rejected, (state) => {
        state.isRoutesLoading = false;
      })
      .addCase(editRouteItem.pending, (state) => {
        state.isEditRouteLoading = true;
        state.editRouteError = null;
        state.isRoutesLoading = true;
      })
      .addCase(editRouteItem.fulfilled, (state, action) => {
        state.isEditRouteLoading = false;
        if (action.payload) {
          const index = state.routes.findIndex(
            (route) => route._id === action.payload._id
          );
          state.routes[index] = action.payload;
        }
        state.isRoutesLoading = false;
      })
      .addCase(editRouteItem.rejected, (state, action) => {
        state.isEditRouteLoading = false;
        state.editRouteError = action.payload;
        state.isRoutesLoading = false;
      })
      .addCase(updateRouteStatus.pending, (state) => {
        state.isRoutesLoading = true;
      })
      .addCase(updateRouteStatus.fulfilled, (state, action) => {
        state.isRoutesLoading = false;
        if (action.payload) {
          const route = state.routes.find(
            (route) => route._id === action.meta.arg.id
          );
          route.status = action.meta.arg.status;
        }
      })
      .addCase(updateRouteStatus.rejected, (state) => {
        state.isRoutesLoading = false;
      });
  },
});

export const {
  setNewCityError,
  setEditCityObject,
  setEditCityError,
  setEditRouteError,
  setEditRouteObject,
  setNewRouteError,
} = RoutesSlice.actions;

export default RoutesSlice.reducer;
