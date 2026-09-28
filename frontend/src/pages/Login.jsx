import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import Logo from "../components/Logo";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import PasswordInput from "../components/PasswordInput"
export default function Login() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = mode === "login" ? await api.login(form) : await api.register(form);
      login(data.user, data.token);
      showToast("Welcome back!", "success");
      navigate("/");
    } catch (err) {
      showToast(err.message || "Failed to log in", "error");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="relative w-full max-w-3xl h-[500px] bg-white rounded-xl shadow-2xl overflow-hidden">

        {/* SIGN-IN form — always on the left half */}
        <div className="absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center p-8">
          <div className="flex justify-center mb-8">
    <Logo textColor="text-ink" size="large" />
  </div>
          <p className="text-muted text-sm mb-6">Sign in</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
              <PasswordInput
    value={form.password}
    onChange={(e) => setForm({ ...form, password: e.target.value })}
  />
    <div className="text-right">
    <Link to="/forgot-password" className="text-xs text-brand hover:underline">
      Forgot password?
    </Link>
  </div>
            <button
              type="submit"
              disabled={loading || mode !== "login"}
              className="w-full bg-brand text-white font-semibold rounded-lg py-2 text-sm hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Sign in"}
            </button>
          </form>
        </div>

        {/* SIGN-UP form — always on the right half */}
        <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center p-8">
         <div className="flex justify-center mb-8">
    <Logo textColor="text-ink" size="large" />
  </div>
          <p className="text-muted text-sm mb-6">Create an account</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
             <PasswordInput
    value={form.password}
    onChange={(e) => setForm({ ...form, password: e.target.value })}
  />
            <button
              type="submit"
              disabled={loading || mode !== "register"}
              className="w-full bg-brand text-white font-semibold rounded-lg py-2 text-sm hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Create account"}
            </button>
          </form>
        </div>

        {/* SLIDING IMAGE OVERLAY — sits on top, slides between covering left/right */}
        <div
          className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center text-white text-center p-8 z-10 transition-transform duration-500 ease-in-out"
          style={{
            backgroundImage: "url('https://picsum.photos/800/1000?random=1')",
            backgroundSize: "cover",
            transform: mode === "login" ? "translateX(100%)" : "translateX(0%)",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10">
            {mode === "login" ? (
              <>
                <h2 className="text-2xl font-bold mb-2">Hello, Friend!</h2>
                <p className="text-sm mb-4">Enter your details and start your journey with us</p>
                <button
                  onClick={() => setMode("register")}
                  className="border border-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-white/10"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
                <p className="text-sm mb-4">Already have an account? Sign in to continue</p>
                <button
                  onClick={() => setMode("login")}
                  className="border border-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-white/10"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}