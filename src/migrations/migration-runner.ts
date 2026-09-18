import dotenv from "dotenv";
import mongoose from "mongoose";
import { MigrationHistory } from "./migration-history.model";
import {
  migrationName as migration001Name,
  up as migration001
} from "./001-create-order-index";

import {
  migrationName as migration002Name,
  up as migration002
} from "./002-create-payment-index";
import {
  migrationName as migration003Name,
  up as migration003
} from "./003-add-order-priority";


dotenv.config();
async function runMigrations() {
  await mongoose.connect(process.env.MONGO_URI!);

  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("Database connection not available");
  }

  const migrations = [
    {
      name: migration001Name,
      up: migration001
    },
    {
      name: migration002Name,
      up: migration002
    },
    {
      name: migration003Name,
      up: migration003
    }

  ];

  for (const migration of migrations) {
    const alreadyExecuted = await MigrationHistory.findOne({
      name: migration.name
    });

    if (alreadyExecuted) {
      console.log(`Migration already executed: ${migration.name}`);
      continue;
    }

    await migration.up(db);

    await MigrationHistory.create({
      name: migration.name
    });

    console.log(`Migration completed: ${migration.name}`);
  }

  await mongoose.disconnect();
}

runMigrations().catch(async (error) => {
  console.error("Migration failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});