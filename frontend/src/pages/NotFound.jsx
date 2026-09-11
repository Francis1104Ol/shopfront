import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Error Code using your custom color */}
        <p className="text-base font-semibold text-ink">404</p>
        
        {/* Main Heading */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        
        {/* Subtext */}
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        
        {/* Navigation Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {/* Main button styled with #111827 and a hover opacity shift */}
          <Link
            to="/"
            className="rounded-md bg-ink px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink transition-colors"
          >
            Go back home
          </Link>
          
        </div>
      </div>
    </main>
  );
}
