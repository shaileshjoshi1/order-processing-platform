import { consumer } from "./kafka";
import { Order } from "../models/order.model";

const MAX_RETRIES = 3;

export async function startOrderConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "order-created",
    fromBeginning: true
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const orderData = JSON.parse(
        message.value?.toString() || "{}"
      );

      console.log("ORDER_CREATED event received:", orderData);

      let success = false;

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(
            `Processing attempt ${attempt}/${MAX_RETRIES}`
          );
          //move pendig to processing order
          await Order.findOneAndUpdate(
            {
              _id: orderData.orderId,
              status: "PENDING"
            },
            { status: "PROCESSING" }
          );

          // Simulate processing work
          await new Promise((resolve) =>
            setTimeout(resolve, 2000)
          );

          // Mark order as completed
           const completedOrder = await Order.findOneAndUpdate(
              {
                _id: orderData.orderId,
                status: "PAID"
              },
              { status: "COMPLETED" },
              { new: true }
            );

            if (completedOrder) {
              console.log("Order status: COMPLETED");
            } else {
              console.log(
                "Payment not completed yet. Keeping current order status."
              );
            }

          

          success = true;
          break;

        } catch (error) {
          console.error(
            `Attempt ${attempt} failed:`,
            error
          );

          if (attempt < MAX_RETRIES) {
            console.log("Retrying...");
          }
        }
      }

      if (!success) {
        await Order.findByIdAndUpdate(
          orderData.orderId,
          { status: "CANCELLED" }
        );

        console.log(
          "Order cancelled after 3 failed attempts"
        );
      }
    }
  });
}