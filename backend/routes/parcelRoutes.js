// -----------------------------------------------------------------------------------
//                              Import / Init Statements
// -----------------------------------------------------------------------------------

import express from "express";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import {
  addCheckPoint,
  calculatecostCalculator,
  createParcel,
  getAllParcels,
  getParcelByTrackingId,
} from "../controllers/parcelController.js";

const router = express.Router();

// -----------------------------------------------------------------------------------
//                              Route Statements
// -----------------------------------------------------------------------------------

router.post("/", protect, adminOnly, createParcel);
router.get("/track/:trackingId", getParcelByTrackingId);
router.post("/:id/checkpoint", protect, adminOnly, addCheckPoint);
router.get("/", protect, adminOnly, getAllParcels);
router.get("/calculate-cost", calculatecostCalculator);

export default router;
