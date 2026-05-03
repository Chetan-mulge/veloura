

require("dotenv").config();
// ==============================
// IMPORTS
// ==============================
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

// ==============================
// MIDDLEWARE
// ==============================
app.use(cors({ origin: "*" }));
app.use(express.json());

// ==============================
// MONGODB CONNECT
// ==============================
// MongoDB connecting...
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("Mongo Error:", err));

// ==============================
// SCHEMA
// ==============================
const orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  phone: String,
  items: Array,
  total: Number,
  paymentId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", orderSchema);

// ==============================
// HEALTH CHECK
// ==============================
app.get("/", (req, res) => {
  res.send("🚀 Backend + MongoDB Working");
});

// ==============================
// VERIFY PAYMENT (SECURE)
// ==============================
app.post("/api/verify", (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    const body = order_id + "|" + payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === signature) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ==============================
// CREATE ORDER (SAVE TO DB)
// ==============================
app.post("/api/order", async (req, res) => {
  try {
    const { name, address, city, state, pincode, phone, items, total, paymentId } = req.body;

    if (!name || !address || !city || !state || !pincode || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const newOrder = new Order({
      name,
      address,
      city,
      state,
      pincode,
      phone,
      items,
      total,
      paymentId
    });

    await newOrder.save();

    console.log("✅ Order Saved:", newOrder);

    res.json({
      success: true,
      orderId: newOrder._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false
    });
  }
});

// ==============================
// GET ALL ORDERS
// ==============================
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// ==============================
// SERVER
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});