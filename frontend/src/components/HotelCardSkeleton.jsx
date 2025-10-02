import React from 'react';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';

export default function HotelCardSkeleton() {
  return (
    <Card className="overflow-hidden border bg-card flex flex-col h-full rounded-lg p-0 gap-0 animate-pulse">
      {/* Image skeleton */}
      <div className="relative overflow-hidden">
        <div className="w-full h-48 bg-gray-200 rounded-t-lg rounded-b-none" />
        
        {/* Rating badge skeleton */}
        <div className="absolute top-3 left-3">
          <div className="h-6 w-12 bg-gray-300 rounded-full" />
        </div>
        
        {/* Price badge skeleton */}
        <div className="absolute top-3 right-3">
          <div className="h-6 w-24 bg-gray-300 rounded-md" />
        </div>
      </div>

      {/* Content skeleton */}
      <CardHeader className="pb-3 pt-6 flex-shrink-0">
        {/* Hotel name skeleton */}
        <div className="h-6 w-4/5 mb-2 bg-gray-200 rounded" />
        
        {/* Description skeleton - 2 lines */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>
      </CardHeader>

      {/* Amenities skeleton */}
      <CardContent className="pt-2 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Amenity icons skeleton */}
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-5 w-5 bg-gray-200 rounded" />
          ))}
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-2 bg-gray-200 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}