import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";

import { createError } from "./../../utils/error.js";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      res.status(400);
      return res.json({
        success: false,
        message: "User with this email already exists!",
      });
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hash,
    });

    await newUser.save();
    const token = jwt.sign(
      {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
      process.env.JWT_SECRET
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        phone: newUser.phone || "",
        defaultPickupAddress: newUser.defaultPickupAddress || "",
      },
      isAdmin: newUser.isAdmin,
    });
  } catch (err) {
    // next(err);
    // throw new Error("Invalid User data");
    console.log(error);
    res.status(500);
    return res.json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400);
      return res.json({
        success: false,
        message: "User with this email does not exist!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400);
      return res.json({
        success: false,
        message: "Invalid password!",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).send({
      success: true,
      message: "Logged in successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone || "",
        defaultPickupAddress: user.defaultPickupAddress || "",
      },
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    // next(err);
    console.log(err);
    res.status(500);
    return res.json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const checkIfUserIsLoggedIn = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401);
    return res.json({
      success: false,
      message: "Not authenticated",
    });
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (decodedToken) {
    const user = await User.findById(decodedToken.id);
    if (!user) {
      res.status(401);
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User is logged in",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone || "",
        defaultPickupAddress: user.defaultPickupAddress || "",
      },
      isAdmin: user.isAdmin,
    });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, defaultPickupAddress } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (defaultPickupAddress !== undefined) user.defaultPickupAddress = defaultPickupAddress;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone || "",
        defaultPickupAddress: user.defaultPickupAddress || "",
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to update profile.",
    });
  }
};
