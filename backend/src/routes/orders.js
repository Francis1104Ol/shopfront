const express = require("express");
const Stripe = require("stripe");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ─── Customer: start checkout ───
// Body: { items: [{ productId, quantity }] }
router.post("/checkout", requireAuth, async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items must be a non-empty array" });
  }

  try {
    // Re-fetch product data server-side — never trust client-sent prices.
    const orderItems = [];
    const lineItems = [];
    let total = 0;

    for (const { productId, quantity } of items) {
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ error: "Quantity must be a whole number of at least 1" });
      }
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ error: `Product not found: ${productId}` });
      if (product.stock < quantity) {
        return res.status(409).json({ error: `Not enough stock for ${product.name}` });
      }

      orderItems.push({ product: product._id, name: product.name, price: product.price, quantity });
      total += product.price * quantity;

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100), // Stripe expects cents
        },
        quantity,
      });
    }

    const order = await Order.create({ user: req.user.id, items: orderItems, total, status: "pending" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/order-confirmation?order=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: { order_id: order._id.toString() },
    });

    order.stripe_session_id = session.id;
    await order.save();

    res.json({ url: session.url, orderId: order._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
});

// ─── Customer: own order history ───
router.get("/", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list orders" });
  }
});

// ─── Admin: all orders ───
router.get("/all", requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list orders" });
  }
});

// ─── Admin: update order status (e.g. mark shipped) ───
router.put("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!["pending", "paid", "shipped", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

module.exports = router;
