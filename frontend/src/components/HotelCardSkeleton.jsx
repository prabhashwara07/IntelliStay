import React from 'react';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';

export default function HotelCardSkeleton() {
  return (
    <Card className="overflow-hidden border bg-card flex flex-col h-full rounded-lg p-0 gap-0">
      {/* Image skeleton */}
      <div className="relative overflow-hidden">
        <Skeleton className="w-full h-48 rounded-t-lg rounded-b-none" />
        
        {/* Rating badge skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        
        {/* Price badge skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>
      </div>

      {/* Content skeleton */}
      <CardHeader className="pb-3 pt-6 flex-shrink-0">
        {/* Hotel name skeleton */}
        <Skeleton className="h-6 w-4/5 mb-2" />
        
        {/* Description skeleton - 2 lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardHeader>

      {/* Amenities skeleton */}
      <CardContent className="pt-2 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Amenity icons skeleton */}
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className="h-5 w-5 rounded" />
          ))}
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}