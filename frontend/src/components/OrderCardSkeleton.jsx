export default function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow p-4 animate-pulse">
      {/* Order number + status badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 bg-gray-200 rounded w-28"></div>
        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
      </div>

      {/* Fake order items */}
      <div className="space-y-2 mb-2">
        <div className="h-3 bg-gray-200 rounded w-40"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Total price */}
      <div className="flex justify-end">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}