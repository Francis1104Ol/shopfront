import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const { clearCart } = useCart();

  // Stripe redirected here after a completed checkout session — cart's job is done.
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6 text-center mt-12">
      <div className="bg-white rounded-xl shadow p-8">
        <div className="text-4xl mb-4">✅</div>
        <h1 className="text-xl font-bold text-ink mb-2">Payment received</h1>
        <p className="text-muted text-sm mb-1">
          Thanks for your order{orderId ? ` (#${orderId.slice(-6)})` : ""}.
        </p>
        <p className="text-muted text-xs mb-6">
          Note: it can take a few seconds for the payment confirmation to reach your order history.
        </p>
        <Link to="/orders" className="text-brand text-sm font-semibold hover:underline">
          View my orders
        </Link>
      </div>
    </div>
  );
}
