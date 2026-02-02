// const mongoose = require("mongoose");

// const otpSchema = new mongoose.Schema({
//   mobile: { type: String, required: true, unique: false }, // no unique index here
//   otp: { type: String, required: true },
//   expiresAt: { type: Date, required: true }
// }, { collection: "otps" }); // force collection name

// module.exports = mongoose.model("Otp", otpSchema);

// const mongoose = require("mongoose");

// const otpSchema = new mongoose.Schema({
//   identifier: { type: String, required: true }, // mobile or email
//   otp: { type: String, required: true },

//   attempts: { type: Number, default: 0 },      // ✅ NEW
//   lockedUntil: { type: Date, default: null },  // ✅ NEW

//   expiresAt: { type: Date, required: true }
// }, { collection: "otps" });

// module.exports = mongoose.model("Otp", otpSchema);

// const mongoose = require("mongoose");

// const otpSchema = new mongoose.Schema({
//   mobile: { type: String, required: true, unique: true },
//   otp: { type: String, required: true },
//   attempts: { type: Number, default: 0 },
//   lockedUntil: { type: Date, default: null },
//   expiresAt: { type: Date, required: true }
// });

// module.exports = mongoose.model("Otp", otpSchema);


const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true }, // mobile OR email
  otp: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  lockedUntil: { type: Date, default: null },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model("Otp", otpSchema);



