import City from "../../models/City.js";
import Route from "../../models/Route.js";
import { getDateTimeFromTime } from "./../../utils/datetime.js";

export const addCity = async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the required fields.",
    });
  }

  try {
    const city = new City({
      name,
    });
    const savedCity = await city.save();
    return res.status(200).json({
      success: true,
      message: "City type added successfully.",
      city: savedCity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const fetchCities = async (req, res, next) => {
  try {
    const cities = await City.find();
    return res.status(200).json({
      success: true,
      cities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCityStatus = async (req, res, next) => {
  try {
    const { cityId, status } = req.body;
    const city = await City.findByIdAndUpdate(
      cityId,
      { status },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "City status updated successfully.",
      city,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeCity = async (req, res, next) => {
  const { cityId } = req.body;

  try {
    const city = await City.findByIdAndDelete(cityId);

    return res.status(200).json({
      success: true,
      message: "City removed successfully.",
      city,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCity = async (req, res, next) => {
  const { _id, name } = req.body;
  try {
    const city = await City.findByIdAndUpdate(_id, { name }, { new: true });

    return res.status(200).json({
      success: true,
      message: "City updated successfully.",
      city,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addRoute = async (req, res) => {
  const { name, from, to, locations } = req.body;
  if (!name || !from || !to || !locations) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the required fields.",
    });
  }

  try {
    const route = new Route({
      name,
      from,
      to,
      locations,
    });
    const savedRoute = await route.save();
    const returnRoute = await Route.findById(savedRoute._id).populate(
      "from to locations"
    );
    return res.status(200).json({
      success: true,
      message: "Route added successfully.",
      route: returnRoute,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const fetchRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate("from to locations");
    return res.status(200).json({
      success: true,
      routes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeRoute = async (req, res) => {
  const { routeId } = req.body;

  try {
    const route = await Route.findByIdAndDelete(routeId);

    return res.status(200).json({
      success: true,
      message: "Route removed successfully.",
      route,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateRoute = async (req, res) => {
  const { _id, name, from, to, locations } = req.body;
  try {
    const route = await Route.findByIdAndUpdate(
      _id,
      { name, from, to, locations },
      { new: true }
    ).populate("from to locations");

    return res.status(200).json({
      success: true,
      message: "Route updated successfully.",
      route,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateRouteStatus = async (req, res) => {
  const { id, status } = req.body;
  try {
    const route = await Route.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("from to locations");

    return res.status(200).json({
      success: true,
      message: "Route status updated successfully.",
      route,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
