import mongoose from "mongoose";
import { Order } from "../models/order.model";
import { Payment } from "../models/payment.model";

export async function createOrderWithPayment(
  customerName: string,
  amount: number,
  simulateFailure =false
) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Create Order
    const order = await Order.create(
      [
        {
          customerName,
          amount,
          status: "PENDING"
        }
      ],
      { session }
    );

    // 2. Intentionally fail for rollback testing
    if (simulateFailure) {
      throw new Error("Simulated payment failure");
    }

    // 2. Create Payment
    const payment = await Payment.create(
      [
        {
          orderId: order[0]._id,
          amount,
          status: "SUCCESS"
        }
      ],
      { session }
    );

    // 3. Commit both operations
    await session.commitTransaction();

    return {
      order: order[0],
      payment: payment[0]
    };
  } catch (error) {
    // Rollback everything if any operation fails
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}