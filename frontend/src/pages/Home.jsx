import { useEffect, useState } from "react";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import {useToast} from "../context/ToastContext"
import Hero from "../components/Hero";
export default function Home() {
  const [products, setProducts] = useState([]);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("")

  useEffect(() => {
     const timer = setTimeout(() => {
      setLoading(true);
      api
      .listProducts(search)
      .then(setProducts)
      .catch((e) => showToast(e.message, "error"))
      .finally(() => setLoading(false));
  }, 400);
  return () => clearTimeout(timer);

},[search, showToast]);

  return (
    <div>
      <Hero />
  
    <div className="max-w-6xl mx-auto p-6">
       <div className="relative w-full sm:max-w-xs mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand bg-white text-ink text-sm"
          />
          </div>
      {loading && (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
)}
 {!loading && products.length === 0 && (
        <p className="text-muted text-sm mt-4">
          {search ? "No products found matching your search." : "No products yet — check back soon."}
        </p>
      )}
      {!loading && (
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      )}
    </div>
    </div>
  );
}
