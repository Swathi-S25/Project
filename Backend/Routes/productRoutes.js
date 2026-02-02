const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const query = {};

    Object.keys(req.query).forEach(key => {
      if (req.query[key]) {
        const values = req.query[key].split(",");
        query[key] = { $in: values };
      }
    });

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
