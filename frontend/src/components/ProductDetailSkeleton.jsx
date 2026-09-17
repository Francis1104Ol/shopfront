export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      {/* Product image */}
      <div className="aspect-square bg-gray-200 rounded-xl"></div>

      {/* Product information */}
      <div>
        {/* Back button is skipped */}

        {/* Product name */}
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>

        {/* Category */}
        <div className="h-4 bg-gray-100 rounded w-1/4 mt-1"></div>

        {/* Price */}
        <div className="h-7 bg-gray-200 rounded w-1/3 mt-4"></div>

        {/* Description */}
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
          <div className="h-4 bg-gray-100 rounded w-2/3"></div>
        </div>

        {/* Stock */}
        <div className="h-3 bg-gray-100 rounded w-1/4 mt-4"></div>

        {/* Quantity + Add to cart */}
        <div className="flex items-center gap-3 mt-4">
          <div className="h-9 w-20 bg-gray-200 rounded-lg"></div>
          <div className="h-9 w-28 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}