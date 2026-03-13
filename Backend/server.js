import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "./models/User.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import Order from "./models/order.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.use("/api", ProductRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is healthy",
    mongoState: mongoose.connection.readyState,
  });
});

app.post("/register", async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: "Registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.password) {
      return res.status(500).json({
        message: "Stored password is missing",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.delete("/users", async (req, res) => {
  try {
    await User.deleteMany({});
    return res.json({ message: "All users deleted successfully" });
  } catch (error) {
    console.error("DELETE USERS ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.post("/orders", async (req, res) => {
  try {
    const {
      userEmail,
      items,
      totalAmount,
      address,
      orderType,
      deliveryTime,
      date,
    } = req.body;

    if (
      !userEmail ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      totalAmount == null
    ) {
      return res.status(400).json({ message: "Missing order details" });
    }

    const newOrder = new Order({
      userEmail,
      items,
      totalAmount,
      address,
      orderType,
      deliveryTime,
      date,
    });

    await newOrder.save();

    return res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("ORDER CREATE ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/orders/:email", async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.params.email }).sort({
      createdAt: -1,
    });

    return res.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});