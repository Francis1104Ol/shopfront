import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function NavBar() {
  const { auth, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <div className="bg-ink text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-bold text-lg">
        Shopfront
      </Link>
      <div className="flex items-center gap-5 text-sm">
        <Link to="/" className="hover:text-accent">Shop</Link>
        {auth && (
          <Link to="/orders" className="hover:text-accent">My Orders</Link>
        )}
        {auth?.user.role === "admin" && (
          <Link to="/admin" className="hover:text-accent">Admin</Link>
        )}
        <Link to="/cart" className="hover:text-accent">
          Cart{count > 0 ? ` (${count})` : ""}
        </Link>
        {auth ? (
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-gray-300 hover:text-white"
          >
            Log out
          </button>
        ) : (
          <Link to="/login" className="bg-brand px-3 py-1.5 rounded-lg font-semibold hover:opacity-90">
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}
