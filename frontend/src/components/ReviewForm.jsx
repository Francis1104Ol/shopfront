import { useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Link } from "react-router-dom";

export default function ReviewForm({ productId, existingReview, onSuccess }) {
  const { auth } = useAuth();
  const { showToast } = useToast();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [saving, setSaving] = useState(false);

  if (!auth) {
    return (
      <p className="text-muted text-sm">
        <Link to="/login" className="text-brand font-semibold hover:underline">
          Log in
        </Link>{" "}
        to leave a review.
      </p>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating < 1) {
      showToast("Please select a star rating", "error");
      return;
    }
    setSaving(true);
    try {
      if (existingReview) {
        await api.updateReview(existingReview._id, { rating, comment }, auth.token);
        showToast("Review updated", "success");
      } else {
        await api.createReview(productId, { rating, comment }, auth.token);
        showToast("Review submitted", "success");
      }
      onSuccess();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5">
      <h3 className="font-bold text-ink mb-3">
        {existingReview ? "Edit your review" : "Leave a review"}
      </h3>

      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl ${star <= rating ? "text-accent" : "text-muted/30"}`}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts on this product..."
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
        rows={3}
        required
      />

      <button
        type="submit"
        disabled={saving}
        className="bg-brand text-white font-semibold rounded-lg px-5 py-2 text-sm hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving..." : existingReview ? "Update review" : "Submit review"}
      </button>
    </form>
  );
}