// -----------------------------------------------------------------------------------
//                              Import / Init Statements
// -----------------------------------------------------------------------------------

import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
// import { User } from "../models/User";
import { addUserSchema, loginSchema } from "../validations/validations.js";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// -----------------------------------------------------------------------------------
//                              Logic Controller Statements
// -----------------------------------------------------------------------------------

export const login = async (req, res, next) => {
  try {
    // Validation using joi
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }
    // Destructuring the value
    const { email, password } = value;
    // check if the user available
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    // Checking the password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    // Generating token
    const token = generateToken(user._id);
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
        ),
      })
      .json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const addUser = async (req, res, next) => {
  try {
    // Validations
    const { error, value } = addUserSchema.validate(req.body);
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { name, email, password } = value;
    console.log(name, email, password);
    // check if the user available
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User Already exists",
      });
    }
    console.log("---------------------------------------------");
    const user = await User.create({
      name,
      email,
      password,
    });
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
