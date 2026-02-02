const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Otp = require("../models/Otp");
const { sendSmsOtp } = require("../services/smsService");
const { sendEmailOtp } = require("../services/emailService");
/* ---------------- HELPERS ---------------- */
const isValidMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);
const isOnlyCharacters = (name) => /^[A-Za-z\s]+$/.test(name);
const isValidGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

/* ---------------- SIGN UP ---------------- */

/* ---------------- SIGN UP ---------------- */
router.post("/signup", async (req, res) => {
  try {
    let { firstName, lastName, mobile, email, password, role } = req.body;

    // Trim and normalize
    firstName = firstName?.trim();
    lastName = lastName?.trim() || "";
    mobile = mobile?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    console.log("Signup request body:", req.body);
    console.log("Trimmed values:", { firstName, lastName, mobile, email, password, role });

    // Required fields check
    if (!firstName || !mobile || !email || !password || !role)
      return res.status(400).json({ message: "All fields required" });

    // Validations
    const nameRegex = /^[A-Za-z\s]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!nameRegex.test(firstName))
      return res.status(400).json({ message: "First name should contain only letters" });
    if (lastName && !nameRegex.test(lastName))
      return res.status(400).json({ message: "Last name should contain only letters" });
    if (!mobileRegex.test(mobile))
      return res.status(400).json({ message: "Please enter a valid 10-digit mobile number" });
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Email must end with @gmail.com" });

    // Check if user exists only if mobile/email are valid
    // Check if user exists ONLY if mobile and email are non-empty
// ------------------------
// ✅ Strict check for existing user
// Only check if mobile/email are valid and non-empty
let userExists = null;
if (mobile && mobile.length === 10 && email) {
  console.log("Checking user exists for mobile:", mobile, "email:", email); // debug
  userExists = await User.findOne({
    $or: [
      { mobile: mobile },
      { email: email }
    ]
  });
}

if (userExists) return res.status(400).json({ message: "User already exists" });

    // Create new user
    const user = await User.create({ firstName, lastName, mobile, email, password, role });

    console.log("User created successfully:", user);
    return res.json({ message: "Account created successfully", user });

  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- SEND OTP ---------------- */
/* ---------------- SEND OTP ---------------- */
/* ---------------- SEND OTP ---------------- */
router.post("/send-otp", async (req, res) => {
  try {
    let { identifier, role } = req.body;
    identifier = identifier?.trim();

    const user = await User.findOne({
      $or: [
        { mobile: identifier },
        { email: identifier?.toLowerCase() }
      ]
    });

    // ❗ USER NOT FOUND
    if (!user) {
      return res.status(404).json({
        message: "User account not found, create account first",
        action: "CREATE_ACCOUNT"
      });
    }

    // Role check
    if (user.role !== role) {
      return res.status(403).json({ 
        message: `You are registered as ${user.role}` 
      });
    }

    // ================= OTP GENERATION =================
    // ================= OTP GENERATION =================
const otp = Math.floor(100000 + Math.random() * 900000).toString();

// 🔥 FIXED: use identifier everywhere
await Otp.deleteMany({ identifier });

await Otp.create({
  identifier,          // mobile OR email
  otp,
  attempts: 0,
  lockedUntil: null,
  expiresAt: new Date(Date.now() + 5 * 60 * 1000)
});

console.log("=================================");
console.log("🔐 OTP DEBUG LOG");
console.log("Identifier:", identifier);
console.log("OTP:", otp);
console.log("=================================");

    // ================= SEND OTP =================
    if (user.mobile) {
  try {
    await sendSmsOtp(user.mobile, otp);
    console.log("SMS OTP sent to:", user.mobile);
  } catch (err) {
    console.error("SMS FAILED (IGNORED):", err.message);
    // ❗ do not throw error
  }
}

if (user.email) {
  try {
    await sendEmailOtp(user.email, otp);
    console.log("Email OTP sent to:", user.email);
  } catch (err) {
    console.error("Email FAILED:", err.message);
  }
}

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ------------
---- VERIFY OTP ---------------- */
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 60 * 60 * 1000; //
router.post("/verify-otp", async (req, res) => {
  try {
    let { identifier, otp, role } = req.body;
    identifier = identifier?.trim();

    // Find the user
    const user = await User.findOne({
      $or: [{ mobile: identifier }, { email: identifier.toLowerCase() }]
    });

    if (!user)
      return res.status(400).json({ message: "User not found, create account first" });

    if (user.role !== role)
      return res.status(403).json({ message: `You are registered as ${user.role}` });

    // 🔒 Check if account is locked
    if (user.otpLockedUntil && user.otpLockedUntil > new Date()) {
      const minsLeft = Math.ceil(
        (user.otpLockedUntil - new Date()) / 60000
      );
      return res.status(403).json({
        message: `Too many wrong OTP attempts. Try again after ${minsLeft} minute(s)`
      });
    }

    // Check OTP
    // Check OTP
const otpDoc = await Otp.findOne({ identifier });

if (
  !otpDoc ||
  String(otpDoc.otp).trim() !== String(otp).trim() ||
  otpDoc.expiresAt < new Date()
) {

  user.otpAttempts = (user.otpAttempts || 0) + 1;

  if (user.otpAttempts >= 5) {
    user.otpLockedUntil = new Date(Date.now() + 60 * 60 * 1000);
    user.otpAttempts = 0;
    await user.save();
    return res.status(403).json({
      message: "Too many wrong OTP attempts. Account locked for 1 hour."
    });
  }

  await user.save();
  return res.status(400).json({
    message: `Invalid OTP. Attempts left: ${5 - user.otpAttempts}`
  });
}

// ✅ Correct OTP
user.otpAttempts = 0;
user.otpLockedUntil = null;
await user.save();

// 🔥 FIXED DELETE
// 🔥 FIXED DELETE
await Otp.deleteMany({ identifier });

// ✅ RETURN FULL USER OBJECT
res.json({
  message: "Login successful",
  user: {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    role: user.role
  }
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
