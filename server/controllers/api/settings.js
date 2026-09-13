import Settings from "../../models/settings.js";

export const fetchTax = async (req, res, next) => {
  try {
    const settings = await Settings.find({});
    const currentTax = settings.length > 0 && settings[0].tax !== undefined && settings[0].tax !== null ? settings[0].tax : 0;

    return res.status(200).json({
      success: true,
      message: "Tax found",
      tax: currentTax,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateTax = async (req, res, next) => {
  const { tax } = req.body;
  if (tax === undefined || tax === null || isNaN(Number(tax)) || Number(tax) < 0) {
    return res.status(400).json({
      success: false,
      message: "A valid non-negative tax value is required",
    });
  }

  try {
    const numericTax = Number(tax);
    const updatedSettings = await Settings.findOneAndUpdate(
      {}, // Find the settings document (if only one settings document exists)
      { $set: { tax: numericTax } }, // Update the tax value
      { new: true, upsert: true } // Create the document if it doesn't exist (upsert: true)
    );

    return res.status(200).json({
      success: true,
      message: "Tax updated successfully",
      tax: updatedSettings.tax,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

