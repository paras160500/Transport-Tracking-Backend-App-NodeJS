// -----------------------------------------------------------------------------------
//                              Import / Init Statements
// -----------------------------------------------------------------------------------

import express from "express";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

// -----------------------------------------------------------------------------------
//                              Route Statements
// -----------------------------------------------------------------------------------

router.get("/stats", protect, adminOnly, getDashboardStats);

export default router;
