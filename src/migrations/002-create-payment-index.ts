import { Db } from "mongodb";

export const migrationName = "002-create-payment-index";

export async function up(db: Db) {
  await db.collection("payments").createIndex({
    orderId: 1
  });

  console.log("Payment orderId index created");
}