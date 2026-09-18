import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import { startOrderConsumer } from "./kafka/order.consumer";
import { startPaymentConsumer } from "./kafka/payment.consumer";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();
  await startOrderConsumer();
  await startPaymentConsumer();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();