import mongoose, { Schema } from "mongoose";

const migrationHistorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    executedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const MigrationHistory = mongoose.model(
  "MigrationHistory",
  migrationHistorySchema
);