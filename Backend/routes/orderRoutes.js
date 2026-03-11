import express from "express";
import Order from "../models/order.js";

const router = express.Router();

/* PLACE ORDER */
router.post("/orders", async (req, res) => {
  try {
console.log("Order received:", req.body);
    const newOrder = new Order(req.body);

    const savedOrder = await newOrder.save();
   // debug
    console.log("Order saved to DB:", savedOrder);
    res.json({
      message: "Order placed successfully",
      order: savedOrder
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/* GET ALL ORDERS */
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;