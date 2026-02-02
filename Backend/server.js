const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require('path');
const productRoutes = require("./routes/productRoutes");
const app = express();
const adminDashboardRoutes = require("./routes/adminDashboard");
const orderRoutes = require("./routes/orderRoutes");

app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/lenskart")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// mongoose.connect("mongodb://127.0.0.1:27017/lenskart_clone")
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.error(err));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/products", productRoutes);
app.use("/api/admin-dashboard", adminDashboardRoutes);
app.use("/api/orders", orderRoutes);
app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
