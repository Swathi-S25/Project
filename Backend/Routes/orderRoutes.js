// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order");
// const Product = require("../models/Product");

// router.post("/place-order", async (req, res) => {
//     console.log("📦 ORDER API HIT");
//   console.log("BODY RECEIVED:", JSON.stringify(req.body, null, 2));
//   try {
//     const { userId, cart, totalAmount } = req.body;

//     // Stock update
//     for (let item of cart) {
//       const product = await Product.findById(item.productId);

//       if (!product || product.stock < item.qty) {
//         return res.status(400).json({ message: "Out of stock" });
//       }

//       product.stock -= item.qty;
//       product.sold += item.qty;

//       if (product.stock === 0) {
//         product.status = "OUT_OF_STOCK";
//       }

//       await product.save();
//     }

//     // Create order
//     const order = await Order.create({
//       userId,
//       products: cart,
//       totalAmount
//     });

//     res.json({ message: "Order placed", order });

//   } catch (err) {
//     res.status(500).json({ message: "Order failed" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Order = require("../models/Order");   // must exist

// ✅ PLACE ORDER
router.post("/place-order", async (req, res) => {

    console.log("REQ BODY:", req.body);
    console.log("USER ID:", req.body.userId);
    console.log("CART:", req.body.cart);
    console.log("CART LENGTH:", req.body.cart?.length);
  try {
    const {
      userId,
      cart,
      totalAmount,
      shippingAddress,
      paymentInfo
    } = req.body;


    if (!userId || !cart || cart.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const newOrder = new Order({
  user: userId,
  items: cart,
  totalAmount,
  shippingAddress,
  paymentInfo,
  status: "Placed",
  orderedAt: Date.now(),
  deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days later
});

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder
    });

  } catch (error) {
    console.error("ORDER SAVE ERROR:", error);
    res.status(500).json({ message: "Order saving failed" });
  }
});


// ✅ GET MY ORDERS
router.get("/my-orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

module.exports = router;
