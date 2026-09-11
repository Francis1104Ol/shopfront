import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.getProduct(id).then(setProduct).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="max-w-3xl mx-auto p-6 text-red-600 text-sm">{error}</p>;
  if (!product) return <p className="max-w-3xl mx-auto p-6 text-muted text-sm">Loading...</p>;

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
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
  );
}
