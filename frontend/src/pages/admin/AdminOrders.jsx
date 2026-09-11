import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const STATUSES = ["pending", "paid", "shipped", "cancelled"];
const STATUS_COLORS = {
  pending: "bg-gray-200 text-gray-700",
  paid: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  function load() {
    api.allOrders(auth.token).then(setOrders).catch((e) => setError(e.message));
  }

  useEffect(load, [auth.token]);

  async function changeStatus(id, status) {
    try {
      await api.updateOrderStatus(id, status, auth.token);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2 className="font-bold text-ink mb-4">All orders ({orders.length})</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-semibold text-ink text-sm">Order #{o._id.slice(-6)}</span>
                <span className="text-muted text-xs ml-2">
                  {o.user?.name} ({o.user?.email})
                </span>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>
                {o.status}
              </span>
            </div>
            <ul className="text-sm text-muted mb-3">
              {o.items.map((item, i) => (
                <li key={i}>
                  {item.quantity}× {item.name}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand text-sm">${o.total.toFixed(2)}</span>
              <select
                value={o.status}
                onChange={(e) => changeStatus(o._id, e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 text-xs"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
