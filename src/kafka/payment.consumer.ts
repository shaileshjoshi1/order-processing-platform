import { paymentConsumer  } from "./kafka";
import { Payment } from "../models/payment.model";
import { Order } from "../models/order.model";

export async function startPaymentConsumer() {
  await paymentConsumer.connect();

  await paymentConsumer.subscribe({
    topic: "order-created",
    fromBeginning: true
  });

  await paymentConsumer.run({
    eachMessage: async ({ message }) => {
      try {
        const orderData = JSON.parse(
          message.value?.toString() || "{}"
        );

        console.log("Payment event received:", orderData);

        const existingPayment = await Payment.findOne({
          orderId: orderData.orderId
        });

        if (existingPayment) {
          console.log("Payment already exists:", orderData.orderId);
          return;
        }



        // 1. Create payment
        const payment = await Payment.create({
          orderId: orderData.orderId,
          amount: orderData.amount,
          status: "SUCCESS"
        });

        console.log("Payment created:", payment._id);

        // 2. Update order status
       await Order.findOneAndUpdate(
        {
          _id: orderData.orderId,
          status: { $in: ["PENDING", "PROCESSING"] }
        },
        { status: "PAID" }
      );


        console.log("Order status: PAID");

        //Complete order after payment

        await Order.findOneAndUpdate(
          {
            _id: orderData.orderId,
            status: "PAID"
          },
          { status: "COMPLETED" }
        );

        console.log("Order status: COMPLETED");

      } catch (error) {
        console.error("Payment processing failed:", error);
      }
    }
  });
}