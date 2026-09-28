import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useToast } from "../context/ToastContext";
import Logo from "../components/Logo";
import PasswordInput from "../components/PasswordInput";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }
    if (password !== confirm) {
      showToast("Passwords don't match", "error");
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      showToast("Password updated. You can now sign in.", "success");
      navigate("/login");
    } catch (err) {
      showToast(err.message || "Reset failed", "error");
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

        {!token ? (
          <div className="text-center">
            <h1 className="text-xl font-bold text-ink mb-2">Invalid reset link</h1>
            <p className="text-muted text-sm mb-6">This link is missing its token. Request a new one.</p>
            <Link to="/forgot-password" className="text-brand text-sm font-semibold hover:underline">
              Request a new link
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-ink mb-1">Set a new password</h1>
            <p className="text-muted text-sm mb-6">Choose a password you haven't used before.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
              />
              <PasswordInput
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm new password"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-white font-semibold rounded-lg py-2 text-sm hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Reset password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}