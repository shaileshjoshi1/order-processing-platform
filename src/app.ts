import express from "express";
import orderRoutes from "./routes/order.routes";

import authRoutes from "./routes/auth.routes";
const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "UP",
    service: "order-processing-platform"
  });
});

app.use("/orders", orderRoutes);

app.use("/auth", authRoutes);

export default app;