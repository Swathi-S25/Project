const mongoose = require("mongoose");
const AppointmentSchema = new mongoose.Schema({
  storeId: Number,
  storeName: String,
  storeAddress: String,

  userName: String,
  userPhone: String,

  purpose: String,
  date: String,
  slot: String,

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
