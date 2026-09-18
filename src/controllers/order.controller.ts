import { Request, Response } from "express";
import { Order } from "../models/order.model";

import { createOrderWithPayment } from "../services/order.service";
import { publishOrderCreated } from "../kafka/order.producer";
export async function createOrderPayment(req: Request, res: Response) {
  try {
    const { customerName, amount , simulateFailure  } = req.body;

    const result = await createOrderWithPayment(
      customerName,
      amount,
      simulateFailure
    );

    res.status(201).json(result);
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Order transaction failed"
    });
  }
}

export async function createOrder(req: Request, res: Response) {
  try {
    const order = await Order.create(req.body);
    await publishOrderCreated({
      orderId: order._id.toString(),
      customerName: order.customerName,
      amount: order.amount
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order" });
  }
}

export async function getOrders(_req: Request, res: Response) {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}

export async function getOrder(req: Request, res: Response) {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
}

export async function deleteOrder(req: Request, res: Response) {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order" });
  }
}