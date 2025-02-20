import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Booking from "./models/Booking.js";
import Razorpay from "razorpay";
import crypto from "crypto";



dotenv.config();
console.log("Razorpay Key ID (Before Initialization):", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Key Secret (Before Initialization):", process.env.RAZORPAY_KEY_SECRET);


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Chatbot API Endpoint
app.post("/api/chatbot", async (req, res) => {
  const userMessage = req.body.message.toLowerCase();

  if (userMessage.includes("book ticket")) {
    return res.json({ reply: "Sure! How many tickets would you like to book?" });
  } else if (userMessage.includes("payment")) {
    return res.json({ reply: "You can complete your payment via Razorpay at our checkout page." });
  } else {
    return res.json({ reply: "I'm here to help! You can ask me about booking tickets or museum timings." });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));

app.post("/api/bookings", async (req, res) => {
    try {
      const { name, email, phone, tickets } = req.body;
      const newBooking = new Booking({ name, email, phone, tickets });
      await newBooking.save();
      res.json({ success: true, message: "Booking confirmed!", booking: newBooking });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error saving booking", error });
    }
  });
  
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "default_key_id", 
    key_secret: process.env.RAZORPAY_KEY_SECRET || "default_key_secret",
  });
  
  

  app.post("/api/payment", async (req, res) => {
    try {
      const { amount } = req.body;
      const options = {
        amount: amount * 100, // Convert INR to paisa (Razorpay uses paisa)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };
  
      const order = await razorpay.orders.create(options);
      res.json({ success: true, order });
    } catch (error) {
      console.error("Payment Error:", error);
      res.status(500).json({ success: false, message: "Payment failed" });
    }
  });
  