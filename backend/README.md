# Shopfront — Backend

Express + MongoDB + Stripe (test mode). Full admin CRUD for products, JWT auth
with customer/admin roles, and a real Stripe Checkout payment flow.

## Setup

1. **MongoDB** — either install locally, or use a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (free tier, no card required for the free tier). Grab your connection string either way.

2. **Stripe test keys (free)**:
   - Sign up at https://dashboard.stripe.com/register — no card needed to get test keys.
   - Go to https://dashboard.stripe.com/test/apikeys and copy your **Secret key** (starts with `sk_test_`).
   - Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks to your local server while developing:
     ```
     stripe login
     stripe listen --forward-to localhost:4000/api/webhook
     ```
     This prints a `whsec_...` value — that's your `STRIPE_WEBHOOK_SECRET`. Keep this command running in a separate terminal whenever you're testing checkout.

3. **Install dependencies:**
   ```
   npm install
   ```

4. **Configure environment:**
   ```
   cp .env.example .env
   ```
   Fill in `MONGO_URI`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.

5. **Create an admin login:**
   ```
   npm run seed:admin
   ```
   Uses `ADMIN_EMAIL`/`ADMIN_PASSWORD` from `.env` (or the defaults printed in
   the console). This is the only way to get an admin account — public
   registration always creates a `customer`, on purpose.

6. **Populate the shop with real-looking demo products (optional but recommended):**
   ```
   npm run seed:products
   ```
   Pulls ~20 real products — names, prices, categories, and actual photos —
   from [Fake Store API](https://fakestoreapi.com), a free public API built
   specifically for seeding demo stores. Safe to run once; running it again
   does nothing unless you explicitly force it:
   ```
   FORCE_SEED=true npm run seed:products
   ```
   (which wipes existing products and reseeds — don't run that once you have
   real orders referencing real products, or those orders' item references
   will point at deleted products.)

   Requires Node 18+ (uses the built-in `fetch`) — you almost certainly have
   this already if you installed Node from nodejs.org recently.

7. **Start the server:**
   ```
   npm run dev
   ```

## Smoke test

```bash
curl http://localhost:4000/api/health

# Log in as admin (use whatever you set in .env)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shopfront.dev","password":"admin1234"}'
# save the returned token as ADMIN_TOKEN

# Create a product
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"name":"Canvas Tote Bag","description":"Sturdy cotton canvas","price":24.99,"stock":50,"category":"bags"}'

# List products (public)
curl http://localhost:4000/api/products

# Register a customer
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"test1234"}'
# save the returned token as CUSTOMER_TOKEN, and the product _id from above

# Start checkout (with `stripe listen` running in another terminal!)
curl -X POST http://localhost:4000/api/orders/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -d '{"items":[{"productId":"PASTE_PRODUCT_ID","quantity":2}]}'
```

That last call returns a Stripe-hosted checkout `url` — open it in a browser
and pay with Stripe's test card `4242 4242 4242 4242`, any future expiry, any
CVC. Watch the `stripe listen` terminal — you should see a
`checkout.session.completed` event, and the order's status should flip to
`paid` automatically (check with `GET /api/orders`).

## Notes

- Prices are stored in whole dollars in MongoDB, converted to cents only when
  talking to Stripe (`unit_amount`) — Stripe's API requires the smallest
  currency unit.
- Stock is decremented only after Stripe confirms payment (in the webhook),
  not at checkout start — so an abandoned checkout session never locks up
  inventory.
- Product prices/names are always re-fetched server-side at checkout, never
  trusted from the client — otherwise someone could tamper with prices in
  the browser before submitting.
