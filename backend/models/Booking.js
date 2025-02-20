import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  tickets: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" },
});

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
