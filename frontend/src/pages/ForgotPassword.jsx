import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useToast } from "../context/ToastContext";
import Logo from "../components/Logo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <Logo textColor="text-ink" size="large" />
        </div>

        {sent ? (
          <div className="text-center">
            <h1 className="text-xl font-bold text-ink mb-2">Check your inbox</h1>
            <p className="text-muted text-sm mb-6">
              If that email exists, a reset link has been sent. The link expires in 1 hour.
            </p>
            <Link to="/login" className="text-brand text-sm font-semibold hover:underline">
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-ink mb-1">Forgot your password?</h1>
            <p className="text-muted text-sm mb-6">
              Enter your email and we'll send you a link to reset it.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-white font-semibold rounded-lg py-2 text-sm hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
            <div className="text-center mt-4">
              <Link to="/login" className="text-muted text-xs hover:underline">
                ← Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}