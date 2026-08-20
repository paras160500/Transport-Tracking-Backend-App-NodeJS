// -----------------------------------------------------------------------------------
//                              Import / Init Statements
// -----------------------------------------------------------------------------------

import express from "express";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import {
  getDeliveryPerformance,
  getParcelGrowth,
  getRevenueAnalysitcs,
  getTopCities,
  getAnalyticsSummary,
} from "../controllers/analysitcController.js";

const router = express.Router();

// -----------------------------------------------------------------------------------
//                              Router Statements
// -----------------------------------------------------------------------------------

router.get("/summary", protect, adminOnly, getAnalyticsSummary);
router.get("/revenue", protect, adminOnly, getRevenueAnalysitcs);
router.get("/parcels", protect, adminOnly, getParcelGrowth);
router.get("/top-cities", protect, adminOnly, getTopCities);
router.get("/delivery-performance", protect, adminOnly, getDeliveryPerformance);

export default router;
