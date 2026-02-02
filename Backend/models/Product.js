const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  brand: String,
  style: String,

  category: String,
  shape: String,
  type: String,
  ageGroup: String,

  frameType: String,
  frameColor: String,
  glassColor: String,
  material: String,
  weightGroup: String,
  collection: String,
  subCollection: String,
  country: String,
  frameWidth: String,
  gender: String,
  productType: String,
  prescriptionType: String,
  supportedPowers: String,

  price: Number,
  rating: Number,
  reviews: Number,

  stock: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["IN_STOCK", "OUT_OF_STOCK"],
    default: "IN_STOCK"
  },

  image: String,

  sizes: [String],
  colors: [String],
  originalPrice: Number,
  discountPercent: Number,
  tagline: String
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
