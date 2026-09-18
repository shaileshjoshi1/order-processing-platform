import { Db } from "mongodb";

export const migrationName = "001-create-order-index";

export async function up(db: Db) {
  await db.collection("orders").createIndex(
    { customerName: 1 }
  );

  console.log("Order customerName index created");
}