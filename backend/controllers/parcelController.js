// -----------------------------------------------------------------------------------
//                              Import / Init Statements
// -----------------------------------------------------------------------------------

import { Parcel } from "../models/Parcel.js";
import { calculatecost } from "../services/calculatecost.js";
import { generateTrackingId } from "../services/generateTrackingId.js";
import {
  addCheckPointSchema,
  calculateCostSchema,
  createParcelSchema,
} from "../validations/validations.js";

// -----------------------------------------------------------------------------------
//                                  Create Parcel
// -----------------------------------------------------------------------------------

export const createParcel = async (req, res, next) => {
  try {
    // Getting data from body
    const { error, value } = createParcelSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    // Calculating the cost
    const priceInfo = calculatecost({
      originCity: value.originCity,
      destinationCity: value.destinationCity,
      shipmentType: value.shipmentType,
      parcelCategory: value.parcelCategory,
      weight: value.weight,
      deliveryType: value.deliveryType,
    });
    // Generating tracking Id
    let trackingId = generateTrackingId();
    if (!trackingId) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate unique Tracking Id",
      });
    }
    // Making parcel and put in the database
    const parcel = await Parcel.create({
      ...value,
      trackingId,
      price: priceInfo.price,
      checkpoints: [
        {
          location: value.originCity,
          status: "arrived",
          title: `Parcel arrived at ${value.originCity} Branch`,
          description: `Your parcel has been arrived at our ${value.originCity} branch and is being processed for the next step in its journey.`,
          updatedBy: req.user ? req.user.name : "system",
        },
      ],
    });
    res.status(200).json({
      success: true,
      parcel,
    });
  } catch (error) {
    next(error);
  }
};

export const getParcelByTrackingId = async (req, res, next) => {
  try {
    const { trackingId } = req.params;
    if (!trackingId) {
      return res.status(401).json({
        success: false,
        message: "Please provide Tracking Id in URL",
      });
    }
    const parcel = await Parcel.findOne({ trackingId });
    if (!parcel) {
      return res.status(401).json({
        success: false,
        message: "Package not found",
      });
    }
    res.status(200).json({
      success: true,
      parcel,
    });
  } catch (error) {
    next(error);
  }
};

export const addCheckPoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = addCheckPointSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const parcel = await Parcel.findOne({ trackingId: id });
    if (!parcel) {
      return res.status(400).json({
        success: false,
        message: "Parcel not Found",
      });
    }
    const checkpoint = {
      ...value,
      updatedBy: req.user ? req.user.name : "system",
      timestamps: new Date(),
    };
    parcel.checkpoints.push(checkpoint);
    await parcel.save();

    res.status(200).json({
      success: true,
      parcel,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllParcels = async (req, res, next) => {
  try {
    // Getting data from req
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;
    // query init
    const matchStage = {};
    // modifying the query based on filters
    if (status) {
      matchStage["lastCheckpoint.status"] = status;
    }
    if (search) {
      matchStage.trackingId = { $regex: search, $options: "i" };
    }
    const skip = (page - 1) * limit;
    const [parcels, total] = await Promise.all([
      Parcel.aggregate([
        {
          $addFields: {
            lastCheckpoint: { $arrayElemAt: ["$checkpoints", -1] },
          },
        },
        {
          $match: matchStage,
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]),
      Parcel.aggregate([
        {
          $addFields: {
            lastCheckpoint: { $arrayElemAt: ["$checkpoints", -1] },
          },
        },
        {
          $match: matchStage,
        },
        {
          $count: "total",
        },
      ]),
    ]);
    const totalCount = total.length > 0 ? total[0].total : 0;
    res.status(200).json({
      success: true,
      data: parcels,
      page,
      limit,
      total: totalCount,
      totalPage: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const calculatecostCalculator = async (req, res, next) => {
  try {
    const { error, value } = calculateCostSchema.validate(req.body);
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const priceInfo = calculatecost(value);
    res.status(200).json({
      success: true,
      priceInfo,
    });
  } catch (error) {
    next(error);
  }
};
