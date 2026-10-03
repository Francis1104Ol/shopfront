import { useState, useEffect,useRef  } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import PasswordInput from "../components/PasswordInput";
const SLIDES = [
  { image: "https://i.pinimg.com/736x/86/68/7e/86687edec563b7236b83aa5e82fb5f18.jpg", heading: "Shop the Latest Trends", subtext: "New arrivals added every week, curated just for you." },
  { image: "https://i.pinimg.com/1200x/3f/73/e7/3f73e76064bed6e2666708a380c59922.jpg", heading: "Fast & Secure Checkout", subtext: "Pay with confidence, powered by Stripe." },
  { image: "https://i.pinimg.com/736x/8c/de/50/8cde500da06645fa04ff9c03fe17838a.jpg", heading: "Real Customer Reviews", subtext: "See what real buyers are saying before you decide." },
  { image: "https://i.pinimg.com/736x/34/d3/8c/34d38c165976fbef5e3e03e451c53bde.jpg", heading: "Free & Easy Returns", subtext: "Changed your mind? Return it, hassle-free." },
];

export default function Login() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [dark, setDark] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = mode === "login" ? await api.login(form) : await api.register(form);
      login(data.user, data.token);
      showToast(mode === "login" ? "Welcome back!" : "Account created!", "success");
      navigate("/");
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  }
const googleButtonRef = useRef(null);

useEffect(() => {
  if (!window.google || !googleButtonRef.current) return;

  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: async (response) => {
      try {
        const data = await api.googleLogin(response.credential);
        login(data.user, data.token);
        showToast("Welcome!", "success");
        navigate("/");
      } catch (err) {
        showToast(err.message || "Google sign-in failed", "error");
      }
    },
  });

  window.google.accounts.id.renderButton(googleButtonRef.current, {
    theme: dark ? "filled_black" : "outline",
    size: "large",
    width: 320,
  });
}, [dark]);
  const slide = SLIDES[slideIndex];
  const inputStyle = dark
    ? "w-full bg-black border border-gray-700 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm"
    : "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm";

  return (
    <div className={`min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-6 py-10 relative ${dark ? "bg-black" : "bg-slate-100"}`}>

      <button
        type="button"
        onClick={() => setDark(!dark)}
        className={`absolute top-6 right-6 w-9 h-9 rounded-full border flex items-center justify-center ${
          dark ? "border-gray-700 text-white" : "border-gray-300 text-ink"
        }`}
        aria-label="Toggle theme"
      >
        {dark ? "⚪" : "⚫"}
      </button>

      {/* Image — desktop only */}
      <div
        className="hidden md:block relative w-full md:w-[45%] h-[560px] rounded-2xl shadow-2xl overflow-hidden bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url('${slide.image}')` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{slide.heading}</h2>
          <p className="text-sm md:text-base text-white/80 max-w-sm">{slide.subtext}</p>
        </div>
      </div>

      {/* Form */}
      <div className="w-full md:w-[40%] max-w-sm">
        <div className="flex justify-center mb-6">
          <Logo textColor={dark ? "text-white" : "text-ink"} size="large" stacked />
        </div>
        <h1 className={`text-xl font-bold text-center mb-1 ${dark ? "text-white" : "text-ink"}`}>
          {mode === "login" ? "Welcome Back" : "Create an account"}
        </h1>
        <p className={`text-sm text-center mb-6 ${dark ? "text-gray-400" : "text-muted"}`}>
          {mode === "login" ? "Sign in to continue" : "Join us and start shopping"}
        </p>
        <div ref={googleButtonRef} className="flex justify-center mb-4" />
<div className={`flex items-center gap-3 mb-4 text-xs ${dark ? "text-gray-500" : "text-muted"}`}>
  <div className={`flex-1 h-px ${dark ? "bg-gray-700" : "bg-gray-200"}`} />
  OR
  <div className={`flex-1 h-px ${dark ? "bg-gray-700" : "bg-gray-200"}`} />
</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <input
              placeholder="Name"
              className={inputStyle}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className={inputStyle}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <PasswordInput
            variant={dark ? "dark" : "light"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {mode === "login" && (
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-brand hover:underline">
                Forgot password?
              </Link>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white font-semibold rounded-lg py-2 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className={`w-full text-center text-xs mt-4 hover:underline ${dark ? "text-gray-400" : "text-muted"}`}
        >
          {mode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
        </button>
      </div>

    </div>
  );
}