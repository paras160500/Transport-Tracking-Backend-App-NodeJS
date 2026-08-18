// -----------------------------------------------------------------------------------
//                              Import / Init Statements
// -----------------------------------------------------------------------------------

import express from "express";
import { addUser, login } from "../controllers/authController.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// -----------------------------------------------------------------------------------
//                              Route Statements
// -----------------------------------------------------------------------------------

router.post("/login", authLimiter, login);
router.post("/add-user", protect, adminOnly, addUser);

export default router;
