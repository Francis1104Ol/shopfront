const express = require("express");
const Product = require("../models/Product");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// ─── Public: list products ───
router.get("/", async (req, res) => {
  try {
    const search = req.query.search?.trim();
    
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to list products" });
  }
});

// ─── Public: get one product ───
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Invalid product id" });
  }
});

// ─── Admin: create product ───
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { name, description, price, image_url, category, stock } = req.body;
  if (!name || price == null) return res.status(400).json({ error: "name and price are required" });
  if (typeof price !== "number" || price < 0) return res.status(400).json({ error: "price must be a non-negative number" });
  if (stock != null && (typeof stock !== "number" || stock < 0)) {
    return res.status(400).json({ error: "stock must be a non-negative number" });
  }

  try {
    const product = await Product.create({ name, description, price, image_url, category, stock });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// ─── Admin: update product ───
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// ─── Admin: delete product ───
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
