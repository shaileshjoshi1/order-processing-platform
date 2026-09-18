import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
  type: String,
  enum: ["ADMIN", "CUSTOMER"],
  default: "CUSTOMER"
}
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);