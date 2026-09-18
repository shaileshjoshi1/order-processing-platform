import { Db } from "mongodb";

export const migrationName = "003-add-order-priority";

export async function up(db: Db) {
  const result = await db.collection("orders").updateMany(
    {
      priority: { $exists: false }
    },
    {
      $set: {
        priority: "NORMAL"
      }
    }
  );

  console.log(
    `Order priority updated for ${result.modifiedCount} records`
  );
}