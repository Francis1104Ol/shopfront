import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import OrderCardSkeleton from "../components/OrderCardSkeleton";


const STATUS_COLORS = {
  pending: "bg-gray-200 text-gray-700",
  paid: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function Orders() {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.myOrders(auth.token)
    .then(setOrders)
    .catch((e) => setError(e.message))
    .finally(()=> setLoading(false))

  }, [auth.token]);

  return (
  <div className="max-w-3xl mx-auto p-6">
    <h1 className="text-2xl font-bold text-ink mb-6">
      My orders
    </h1>

    {error && (
      <p className="text-red-600 text-sm">
        {error}
      </p>
    )}

    {!loading && orders.length === 0 && (
      <p className="text-muted text-sm">
        No orders yet.
      </p>
    )}

    <div className="space-y-3">
      {loading
        ? [1, 2, 3].map((item) => (
            <OrderCardSkeleton key={item} />
          ))
        : orders.map((o) => (
            <div
              key={o._id}
              className="bg-white rounded-xl shadow p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-ink text-sm">
                  Order #{o._id.slice(-6)}
                </span>

                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    STATUS_COLORS[o.status]
                  }`}
                >
                  {o.status}
                </span>
              </div>

              <ul className="text-sm text-muted mb-2">
                {o.items.map((item, i) => (
                  <li key={i}>
                    {item.quantity}× {item.name}
                  </li>
                ))}
              </ul>

              <p className="text-right font-bold text-brand text-sm">
                ${o.total.toFixed(2)}
              </p>
            </div>
          ))}
    </div>
  </div>
);
}