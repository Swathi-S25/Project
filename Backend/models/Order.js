const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        productId: String,
        name: String,
        price: Number,
        qty: Number,
        image: String
      }
    ],

    totalAmount: Number,

    shippingAddress: Object,

    paymentInfo: {
      paymentId: String,
      method: String,
      status: String
    },

    status: {
      type: String,
      default: "Placed"
    },

    orderedAt: {
      type: Date,
      default: Date.now
    },

    deliveryDate: {
      type: Date
    }

  },
  { timestamps: true } // keeps createdAt & updatedAt
);

module.exports = mongoose.model("Order", orderSchema);
