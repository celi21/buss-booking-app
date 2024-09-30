import Settings from "../../models/settings.js";

export const fetchTax = async (req, res, next) => {
  try {
    const settings = await Settings.find({});

    return res.status(200).send({
      success: true,
      message: "Tax found",
      tax: settings[0].tax,
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateTax = async (req, res, next) => {
  const { tax } = req.body;
  if (!tax) return res.status(200).send("Tax value is required");

  try {
    const updatedSettings = await Settings.findOneAndUpdate(
      {}, // Find the settings document (if only one settings document exists)
      { $set: { tax: tax } }, // Update the tax value
      { new: true, upsert: true } // Create the document if it doesn't exist (upsert: true)
    );

    return res.status(200).send({
      success: true,
      message: "Tax Updated",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
    });
  }
};
