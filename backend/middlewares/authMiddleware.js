// -----------------------------------------------------------------------------------
//                              Import / Init Statements
// -----------------------------------------------------------------------------------

import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// -----------------------------------------------------------------------------------
//                              Middleware Statements
// -----------------------------------------------------------------------------------

// Check user Middleware
export const protect = async (req, res, next) => {
  try {
    let token;
    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token
      token = req.headers.authorization.split(" ")[1];
    }
    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorised. No token provided.",
      });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user
    const user = await User.findById(decoded.id).select("-password");
    // User doesn't exist
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorised. User not found.",
      });
    }
    // Attach user to request
    req.user = user;
    // Continue to next middleware
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorised, token failed.",
    });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied, Admins only",
      });
    }
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorised, token failed.",
    });
  }
};
