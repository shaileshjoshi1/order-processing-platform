import { Router } from "express";

import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
 createOrderPayment 
} from "../controllers/order.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate,requireRole("ADMIN", "CUSTOMER")
, createOrder);
router.get("/", authenticate,requireRole("ADMIN", "CUSTOMER")
, getOrders);
router.get("/:id", authenticate,requireRole("CUSTOMER"), getOrder);
router.put("/:id", authenticate,requireRole("ADMIN"),
 updateOrder);
router.delete("/:id", authenticate,requireRole("ADMIN"),
 deleteOrder);

router.post(
  "/with-payment",
  authenticate,
  createOrderPayment
);

export default router;