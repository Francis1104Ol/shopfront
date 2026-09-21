import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { auth } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [productError, setProductError] = useState("");
  const [added, setAdded] = useState(false);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    setProductLoading(true);
    setProductError("");
    api.getProduct(id)
      .then(setProduct)
      .catch((e) => {
        setProductError(e.message);
        showToast(e.message, "error");
      })
      .finally(() => setProductLoading(false));
  }, [id]);

  function fetchReviews() {
    api.getReviews(id)
      .then(setReviews)
      .catch((e) => showToast(e.message, "error"));
  }

  useEffect(() => {
    fetchReviews();
  }, [id]);

  if (productLoading) {
    return <ProductDetailSkeleton />;
  }
  if (productError) return <p className="max-w-3xl mx-auto p-6 text-red-600 text-sm">{productError}</p>;

  if (!product) {
    return (
      <p className="max-w-3xl mx-auto p-6 text-muted text-sm">
        Product not found.
      </p>
    );
  }

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    showToast(`${product.name} added to cart!`, "success");
    setTimeout(() => setAdded(false), 1500);
  }

  // review.user is a populated Mongoose document (_id), auth.user is our
  // reshaped API response (id) — these are two different shapes, not the same one.
  const myExistingReview = reviews.find(
    (review) => review.user?._id === auth?.user?.id
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-sm">No image</span>
          )}
        </div>

        <div>
          <button onClick={() => navigate(-1)} className="text-muted text-xs mb-3 hover:underline">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-ink">{product.name}</h1>
          <p className="text-muted text-sm mt-1">{product.category}</p>
          <p className="text-2xl font-bold text-brand mt-4">${product.price.toFixed(2)}</p>
          <p className="text-ink text-sm mt-4">{product.description}</p>

          <p className="text-xs text-muted mt-4">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mt-4">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={handleAdd}
                className="bg-brand text-white font-semibold rounded-lg px-5 py-2 text-sm hover:opacity-90"
              >
                {added ? "Added ✓" : "Add to cart"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-muted/10 pt-8 mt-12 space-y-12">
        <ReviewForm
          productId={id}
          existingReview={myExistingReview}
          onSuccess={fetchReviews}
        />

        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}