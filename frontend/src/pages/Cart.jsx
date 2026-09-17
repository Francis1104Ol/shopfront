import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { useToast } from "../context/ToastContext";

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {showToast} =useToast()

  async function handleCheckout() {
    if (!auth) {
      navigate("/login");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { url } = await api.checkout(
        items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        auth.token
      );
      window.location.href = url; // redirect to Stripe's hosted checkout page
    } catch (err) {
      showToast(message || "Checkout failed. Please try again.", "error");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-ink mb-6">Your cart</h1>

      {items.length === 0 && <p className="text-muted text-sm">Your cart is empty.</p>}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.productId} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
              {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ink text-sm">{item.name}</p>
              <p className="text-muted text-xs">${item.price.toFixed(2)} each</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
              className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm"
            />
            <span className="font-semibold text-ink text-sm w-16 text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button onClick={() => removeItem(item.productId)} className="text-red-500 text-xs hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-ink">Total</span>
            <span className="text-xl font-bold text-brand">${total.toFixed(2)}</span>
          </div>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-brand text-white font-semibold rounded-lg py-3 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Redirecting to checkout..." : "Checkout with Stripe"}
          </button>
          {!auth && <p className="text-xs text-muted text-center mt-2">You'll be asked to sign in first.</p>}
        </div>
      )}
    </div>
  );
}
