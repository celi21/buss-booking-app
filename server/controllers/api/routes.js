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
