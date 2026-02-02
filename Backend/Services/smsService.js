const axios = require("axios");

const sendSmsOtp = async (mobile, otp) => {
  console.log("📱 Sending OTP via 2Factor SMS:", mobile, otp);

  const apiKey = process.env.TWOFACTOR_API_KEY;

  if (!apiKey) {
    throw new Error("2FACTOR API KEY NOT LOADED");
  }

  // 🔥 SMS OTP URL (NOT VOICE)
  const url = `https://2factor.in/API/V1/${apiKey}/SMS/${mobile}/${otp}/OTP1`;

  try {
    const response = await axios.get(url);
    console.log("✅ 2Factor SMS Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ 2Factor SMS Error:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = { sendSmsOtp };
