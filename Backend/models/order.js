import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  items: [
    {
      productId: String,
      title: String,
      price: Number,
      image: String,
      quantity: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    default: ""
  },
  orderType: {
    type: String,
    default: "Home Delivery"
  },
  deliveryTime: {
    type: String,
    default: ""
  },
  date: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;