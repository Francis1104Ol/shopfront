// One-time script to populate your shop with real-looking demo products —
// names, prices, categories, and actual photos — pulled from Fake Store API
// (https://fakestoreapi.com), a free public API built specifically for
// seeding demo e-commerce stores. Run with: npm run seed:products
require("dotenv").config();
const connectDB = require("./db");
const Product = require("./models/Product");

async function seed() {
  await connectDB();

  const existingCount = await Product.countDocuments();
  if (existingCount > 0 && process.env.FORCE_SEED !== "true") {
    console.log(`You already have ${existingCount} product(s). Nothing changed.`);
    console.log("To wipe and reseed anyway, run: FORCE_SEED=true npm run seed:products");
    process.exit(0);
  }

  console.log("Fetching sample products from Fake Store API...");
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) {
    console.error(`Failed to fetch sample products: ${res.status}`);
    process.exit(1);
  }
  const items = await res.json();

  if (existingCount > 0) {
    await Product.deleteMany({});
    console.log(`Cleared ${existingCount} existing product(s).`);
  }

  const products = items.map((item) => ({
    name: item.title,
    description: item.description,
    price: item.price,
    image_url: item.image,
    category: item.category,
    stock: Math.floor(Math.random() * 40) + 10, // Fake Store API has no stock field, so we fill in a plausible number
  }));

  await Product.insertMany(products);
  console.log(`✅ Seeded ${products.length} products.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
