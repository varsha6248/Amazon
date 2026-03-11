import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// all products
router.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// single product by custom numeric id
router.get("/products/:id", async (req, res) => {
  const product = await Product.findOne({ id: Number(req.params.id) });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(products);
});

export default router;