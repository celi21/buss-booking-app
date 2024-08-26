import City from "../../models/City.js";
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
