require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./db");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const webhookRoutes = require("./routes/webhook");
const reviewRoutes = require("./routes/reviews");
const passwordResetRoutes = require("./routes/password-reset");
const { authLimiter, generalLimiter } = require("./middleware/rateLimit");

const app = express();

app.use(helmet());

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",");
app.use(cors({ origin: allowedOrigins, credentials: true }));

// IMPORTANT: the webhook route needs the raw request body for Stripe's signature
// check, so it's mounted BEFORE express.json() and does its own raw parsing.
app.use("/api/webhook", webhookRoutes);

app.use(express.json());
app.use(mongoSanitize());

app.use(generalLimiter);

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/password-reset", authLimiter, passwordResetRoutes);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Shopfront backend running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });