import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();
  const tab = location.pathname.includes("orders") ? "orders" : "products";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-ink mb-4">Admin</h1>
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <Link
          to="/admin"
          className={`pb-2 text-sm font-semibold ${tab === "products" ? "text-brand border-b-2 border-brand" : "text-muted"}`}
        >
          Products
        </Link>
        <Link
          to="/admin/orders"
          className={`pb-2 text-sm font-semibold ${tab === "orders" ? "text-brand border-b-2 border-brand" : "text-muted"}`}
        >
          Orders
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
