import mongoose from "mongoose";

const checkpointSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["arrived", "in_transit", "out_for_delivery", "delivered"],
      required: true,
    },
    timestamps: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const parcelSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    senderPhone: {
      type: String,
      required: true,
      trim: true,
    },
    senderAddress: {
      type: String,
      required: true,
      trim: true,
    },
    receiverName: {
      type: String,
      required: true,
      trim: true,
    },
    receiverPhone: {
      type: String,
      required: true,
      trim: true,
    },
    receiverAddress: {
      type: String,
      required: true,
      trim: true,
    },
    shipmentType: {
      type: String,
      enum: ["national", "international"],
      required: true,
    },
    originCity: {
      type: String,
      required: true,
      trim: true,
    },
    destinationCity: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryType: {
      type: String,
      enum: ["standard", "overnight", "sameDay"],
      required: true,
    },
    parcelCategory: {
      type: String,
      enum: [
        "documents",
        "electronics",
        "clothing",
        "food",
        "medicine",
        "cosematics",
        "books",
        "small_package",
        "large_package",
        "perishables",
        "other",
      ],
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    checkpoints: [checkpointSchema],
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Parcel = mongoose.model("Parcel", parcelSchema);
