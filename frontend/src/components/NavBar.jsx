import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import Logo from "./Logo";

export default function NavBar() {
  const { auth, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  if (location.pathname === "/login") return null;

  return (
    <>
      <div className="bg-ink text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-bold text-lg">
        <Logo />
      </Link>
      <button onClick={()=>setIsOpen(!isOpen)}
      className="sm:hidden text-xl focus:outline-none"
      >
      {isOpen ? "✕" : "☰"}
  
      </button>
      
      <div className="items-center gap-5 text-sm hidden sm:flex">
        {}
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
      {isOpen && (
        <div className="sm:hidden bg-ink text-white px-6 pb-6 border-t border-gray-800">
          <div className="flex flex-col gap-4 text-sm pt-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-accent">
              Shop
            </Link>
            {auth && (
              <Link to="/orders" onClick={() => setIsOpen(false)} className="hover:text-accent">
                My Orders
              </Link>
            )}
            {auth?.user.role === "admin" && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="hover:text-accent">
                Admin
              </Link>
            )}
            <Link to="/cart" onClick={() => setIsOpen(false)} className="hover:text-accent">
              Cart{count > 0 ? ` (${count})` : ""}
            </Link>
            {auth ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                  navigate("/");
                }}
                className="text-gray-300 hover:text-white text-left"
              >
                Log out
              </button>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)} 
                className="bg-brand px-3 py-1.5 rounded-lg font-semibold hover:opacity-90 inline-block text-center"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
