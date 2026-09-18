import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
    enum: [
    "PENDING",
    "PROCESSING",
    "PAID",
    "COMPLETED",
    "CANCELLED"
  ],
  default: "PENDING"
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);