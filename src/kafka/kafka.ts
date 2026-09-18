import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "order-processing-platform",
  brokers: ["localhost:9092"]
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({
  groupId: "order-service-group"
});

export const paymentConsumer = kafka.consumer({
  groupId: "payment-service-group"
});
