const express = require("express");
const Stripe = require("stripe");
const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Requires express.raw() body parsing (set up in index.js) — Stripe's signature
// verification needs the exact raw bytes, not a re-serialized JSON object.
router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;

    try {
      const order = await Order.findById(orderId);
      if (order && order.status === "pending") {
        order.status = "paid";
        await order.save();

        // Decrement stock now that payment is actually confirmed — not at checkout start,
        // so an abandoned Stripe session never locks up inventory.
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }
        console.log(`✅ Order ${orderId} marked paid`);
      }
    } catch (err) {
      console.error("Failed to update order after payment:", err);
    }
  }

  res.json({ received: true });
});

module.exports = router;
