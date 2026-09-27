import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product._id}`}
      className="group block bg-white rounded-xl shadow hover:shadow-lg transition duration-300 hover:-translate-y-1 overflow-hidden"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>
      <div className="p-4">
        <p className="font-semibold text-ink text-sm">{product.name}</p>
        <p className="text-muted text-xs mt-1">{product.category}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-brand">${product.price.toFixed(2)}</span>
          {product.stock === 0 && <span className="text-xs text-red-600 font-semibold">Out of stock</span>}
        </div>
      </div>
    </Link>
  );
}
