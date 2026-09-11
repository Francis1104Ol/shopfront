# Shopfront — Frontend

React + Vite + Tailwind. Talks to the Shopfront backend over REST.

## Setup

```
npm install
cp .env.example .env
npm run dev
```

Runs at http://localhost:5173. Make sure the backend is running on
http://localhost:4000 first (see backend/README.md) — including
`stripe listen --forward-to localhost:4000/api/webhook` in its own terminal
if you want checkout to actually mark orders as paid.

## What's here

- **/** — public catalog, browse products
- **/product/:id** — product detail, add to cart
- **/cart** — cart, quantity edit, "Checkout with Stripe" → redirects to
  Stripe's hosted checkout page
- **/order-confirmation** — where Stripe sends you back after a successful
  payment
- **/login** — sign in / register (registration always creates a customer)
- **/orders** — signed-in customer's order history
- **/admin** and **/admin/orders** — admin-only: product CRUD and order
  status management (requires an admin account — see
  `backend/README.md`'s `npm run seed:admin`)

## Manual test checklist (do this once both servers are running)

1. Go to `/admin` — you'll be redirected to `/login` since you're not signed
   in yet. Sign in with the admin account from `npm run seed:admin`.
2. In Admin → Products, create a product (name, price, stock — image URL is
   optional).
3. Log out, register a normal customer account.
4. Go to the shop, add the product to cart, go to `/cart`, click
   **Checkout with Stripe**.
5. On Stripe's page, pay with test card `4242 4242 4242 4242`, any future
   expiry date, any 3-digit CVC, any ZIP.
6. You should land on `/order-confirmation`, then `/orders` should show the
   order — give it a couple seconds for the webhook to mark it `paid` (watch
   the `stripe listen` terminal to see the event arrive).
7. Back in Admin → Orders, you should see the same order and be able to
   change its status to `shipped`.

If step 6 never flips to `paid`, the webhook likely isn't reaching your
backend — double check `stripe listen` is running and
`STRIPE_WEBHOOK_SECRET` in the backend's `.env` matches what it printed.
