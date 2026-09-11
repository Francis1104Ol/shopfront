import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white shadow overflow-hidden">
      <div className="aspect-square w-full bg-gray-100" />

      <div className="p-4 space-y-3">
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-1/4 rounded bg-gray-200" />
      </div>
    </div>
  );
}