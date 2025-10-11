import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { useGetHotelReviewsQuery } from '@/src/store/api';

export default function HotelReviews({ hotelId, hotelName }) {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5; // Reviews per page

  const {
    data: reviewsResponse,
    isLoading,
    isError,
    error
  } = useGetHotelReviewsQuery(
    { hotelId, page: currentPage, limit },
    { skip: !hotelId || hotelId === undefined || hotelId === null || hotelId === '' }
  );

  // Early return if no hotelId
  if (!hotelId) {
    return null;
  }

  const reviews = reviewsResponse?.data || [];
  const pagination = reviewsResponse?.pagination || {};
  const { total = 0, totalPages = 0 } = pagination;

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Guest Reviews</h3>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Guest Reviews</h3>
          </div>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load reviews</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Guest Reviews</h3>
            {total > 0 && (
              <span className="text-sm text-muted-foreground">
                ({total} review{total !== 1 ? 's' : ''})
              </span>
            )}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Reviews Yet</h4>
            <p className="text-muted-foreground">
              Be the first to share your experience at {hotelName}!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-border/50 last:border-b-0 pb-6 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {review.userFirstName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1 mx-4">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}