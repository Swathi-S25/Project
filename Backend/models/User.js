const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "buyer"], required: true },
  createdAt: { type: Date, default: Date.now },

  // 🔐 OTP security fields (ADDED HERE)
  otpAttempts: {
    type: Number,
    default: 0
  },
  otpLockedUntil: {
    type: Date,
    default: null
  }
});


// // Ensure indexes
// userSchema.index({ mobile: 1 }, { unique: true });
// userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
