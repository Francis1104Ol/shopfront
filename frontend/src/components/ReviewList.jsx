export default function ReviewList({ reviews = [] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-muted italic mt-4 text-center py-6 border border-dashed border-muted/30 rounded-lg animate-fade-in">
        No reviews yet — be the first!
      </p>
    );
  }

  return (
    <div className="space-y-6 mt-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-ink border-b border-muted/10 pb-2">
        Customer Reviews ({reviews.length})
      </h2>
      
      <div className="divide-y divide-muted/10">
        {reviews.map((review) => {
          const totalStars = 5;
          const filledStars = '★'.repeat(review.rating);
          const emptyStars = '☆'.repeat(totalStars - review.rating);
          const reviewerName = review.user?.name || "Anonymous";

          return (
            <article key={review._id} className="py-6 first:pt-2 last:pb-2">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="font-semibold text-ink text-base">
                  {reviewerName}
                </h3>
                
                {review.verifiedPurchase && (
                  <span 
                    className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full border border-green-200"
                    aria-label="Verified Purchase"
                  >
                    ✓ Verified Purchase
                  </span>
                )}
              </div>

              {/* Star Rating using custom accent and muted colors */}
              <div 
                className="text-accent text-lg tracking-wider mb-3 select-none" 
                aria-label={`${review.rating} out of ${totalStars} stars`}
                title={`${review.rating}/${totalStars} Stars`}
              >
                <span aria-hidden="true">
                  {filledStars}
                  <span className="text-muted/30">{emptyStars}</span>
                </span>
              </div>

              <p className="text-ink/80 text-sm leading-relaxed mb-3 whitespace-pre-line">
                {review.comment}
              </p>
              
              {review.createdAt && (
                <time 
                  className="block text-xs text-muted font-medium" 
                  dateTime={review.createdAt}
                >
                  {new Date(review.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
