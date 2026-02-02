const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order"); // you must have Order model

/* ---------------------------
1️⃣ Last 30 Days Orders
--------------------------- */
router.get("/sales/last-30-days", async (req, res) => {
  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);

    const orders = await Order.find({
      createdAt: { $gte: fromDate }
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------------------
2️⃣ Change Order Status
--------------------------- */
router.put("/order/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------------------
3️⃣ Inventory + Stock + Sold
--------------------------- */
router.get("/products/stock", async (req, res) => {
  try {
    const products = await Product.find();

    const data = products.map(p => ({
      _id: p._id,
      name: p.name,
      stock: p.stock,
      sold: p.sold || 0,
      image: p.image,
      frameColor: p.frameColor,
      status: p.stock === 0 ? "SOLD OUT" : "AVAILABLE"
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/product/:id/restock", async (req, res) => {
  try {
    const { qty } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stock += qty;
    product.status = product.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK";

    await product.save();

    res.json({ message: "Restocked", product });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/product", async (req, res) => {
  try {
    let { name, price, stock, image, frameColor, category, brand, shape } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Split category if admin entered "Sunglasses-Square"
    if (category.includes("-")) {
      const parts = category.split("-");
      category = parts[0]; // "Sunglasses"
      shape = parts[1];    // "Square"
    }

    const product = new Product({
      name,
      brand: brand || "",
      style: "Modern",
      category, // now always matches frontend filter
      shape: shape || null, // use shape if provided
      type: category.includes("Contact") ? "Zero Power" : null,
      ageGroup: category.includes("Kids") ? "5-8 Years" : null,
      frameColor: frameColor || "Black",
      price: Number(price) || 999,
      stock: Number(stock) || 0,
      sold: 0,
      status: Number(stock) > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
      image: image || "/fallback.jpg",
      sizes: ["Medium"],
      colors: [frameColor || "Black"],
      rating: 4.5,
      reviews: 10
    });

    await product.save();
    res.json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
