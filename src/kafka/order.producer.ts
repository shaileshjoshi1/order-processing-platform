import { producer } from "./kafka";

export async function publishOrderCreated(order: {
  orderId: string;
  customerName: string;
  amount: number;
}) {
  await producer.connect();

  await producer.send({
    topic: "order-created",
    messages: [
      {
        key: order.orderId,
        value: JSON.stringify(order)
      }
    ]
  });

  console.log("ORDER_CREATED event published");
}