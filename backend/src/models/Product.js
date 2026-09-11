const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 }, // stored in whole currency units (e.g. dollars)
    image_url: { type: String, default: "" },
    category: { type: String, default: "general" },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
