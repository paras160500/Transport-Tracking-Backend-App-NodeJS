// -----------------------------------------------------------------------------------
//                              Import / Init Statements
// -----------------------------------------------------------------------------------

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import swaggerUI from "swagger-ui-express";
import cookieParser from "cookie-parser";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { authLimiter, globalLimiter } from "./middlewares/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import parcelRoutes from "./routes/parcelRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

export const app = express();

// -----------------------------------------------------------------------------------
//                              Import / Init Statements
// -----------------------------------------------------------------------------------

// Adding middleware
app.use(cookieParser());
app.use(helmet()); // For saving system from outsiders
app.use(cors()); // For frontend domain defiing
app.use(morgan("dev")); // For Logs
app.use(compression()); // For reducing the file size for performance
app.use(express.json()); // For body parser
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Global Ratelimiter
app.use(globalLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Working Perfectly.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/parcel", parcelRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
