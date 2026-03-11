import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true
    },
    items: [
      {
        productId: Number,
        title: String,
        price: Number,
        image: String,
        quantity: Number
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);