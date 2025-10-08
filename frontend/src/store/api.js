import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { get } from 'react-hook-form'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    prepareHeaders: async (headers) => {
      try {
        const clerk = window?.Clerk
        const token = await clerk?.session?.getToken()
        if (token) headers.set('Authorization', `Bearer ${token}`)
      } catch (_) {
        // no-op if Clerk/session not available
      }
      return headers
    },
  }),
  tagTypes: ['Hotels', 'BillingProfile', 'Bookings', 'Admin'],
  endpoints: (build) => ({
    getOwnerHotels: build.query({
      query: () => 'hotels/owner/my-hotels',
      providesTags: () => [{ type: 'Hotels', id: 'OWNER_LIST' }],
    }),
    createRoom: build.mutation({
      query: ({ hotelId, room }) => ({
        url: `hotels/${hotelId}/rooms`,
        method: 'POST',
        body: room,
      }),
      invalidatesTags: (_res, _err, { hotelId }) => [
        { type: 'Hotels', id: 'OWNER_LIST' },
        { type: 'Hotels', id: hotelId },
      ],
    }),
    getAllHotels: build.query({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        
        // Add all filter parameters if they exist
        if (filters.country && filters.country.length > 0) {
          params.append('country', filters.country);
        }
        if (filters.search && filters.search.length > 0) {
          params.append('search', filters.search);
        }
        if (filters.minPrice) {
          params.append('minPrice', filters.minPrice.toString());
        }
        if (filters.maxPrice) {
          params.append('maxPrice', filters.maxPrice.toString());
        }
        if (filters.starRating && filters.starRating.length > 0) {
          // Handle multiple star ratings
          filters.starRating.forEach(rating => {
            params.append('starRating', rating.toString());
          });
        }
        if (filters.amenities && filters.amenities.length > 0) {
          // Handle multiple amenities
          filters.amenities.forEach(amenity => {
            params.append('amenities', amenity);
          });
        }
        if (filters.onlyTopRated) {
          params.append('onlyTopRated', 'true');
        }
        
        const queryString = params.toString();
        return queryString ? `hotels?${queryString}` : 'hotels';
      },
      providesTags: () => [{ type: 'Hotels', id: 'LIST' }],
    }),
    getHotelById: build.query({
      query: (id) => `hotels/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Hotels', id }],
    }),
    getHotelsBySearch: build.query({
      query: (search) => `hotels/search?query=${encodeURIComponent(search)}`,
      providesTags: (_result, _error, search) => [{ type: 'Hotels', search }],
    }),
    getCountries: build.query({
      query: () => 'locations/countries',
    }),
    getBillingProfile: build.query({
      query: (userId) => `billing-profile/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: 'BillingProfile', id: userId }],
    }),
    createOrUpdateBillingProfile: build.mutation({
      query: (body) => ({
        url: 'billing-profile',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'BillingProfile', id: userId }],
    }),
    getBookingsByUserId: build.query({
      query: ({ userId, paymentStatus, startDate, endDate }) => {
        let url = `bookings/user/${userId}`;
        const params = new URLSearchParams();
        
        if (paymentStatus && paymentStatus !== 'all') {
          params.append('paymentStatus', paymentStatus);
        }
        if (startDate) {
          params.append('startDate', startDate);
        }
        if (endDate) {
          params.append('endDate', endDate);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        return url;
      },
      providesTags: (_result, _error, { userId }) => [{ type: 'Bookings', id: userId }],
    }),
    getOwnerBookings: build.query({
      query: ({ paymentStatus, startDate, endDate, hotelId } = {}) => {
        const params = new URLSearchParams();
        if (paymentStatus && paymentStatus !== 'all') params.append('paymentStatus', paymentStatus);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (hotelId) params.append('hotelId', hotelId);
        const qs = params.toString();
        return qs ? `bookings/owner?${qs}` : 'bookings/owner';
      },
      providesTags: () => [{ type: 'Bookings', id: 'OWNER' }],
    }),
    createBooking: build.mutation({
      query: (bookingData) => ({
        url: 'bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Bookings'],
    }),
    getResultsByAiSearch: build.query({
      query: (search) => `hotels/search/ai?query=${encodeURIComponent(search)}`
    }),
    // removed owner metrics endpoint as dashboard is removed
    createHotel: build.mutation({
      query: (hotelData) => ({
        url: '/hotels/createhotel',
        method: 'POST',
        body: hotelData,
      }),
      // Invalidate hotels cache after successful creation
      invalidatesTags: ['Hotel'],
    }),
    // Admin endpoints
    getHotelRequests: build.query({
      query: () => 'admin/hotel-requests',
      // Disable caching for this endpoint
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }),
    approveHotelRequest: build.mutation({
      query: (requestId) => ({
        url: `admin/approve/${requestId}`,
        method: 'PUT',
      }),
      // No tag invalidation needed when caching is disabled
    }),
    rejectHotelRequest: build.mutation({
      query: ({ requestId, reason }) => ({
        url: `admin/reject/${requestId}`,
        method: 'PUT',
        body: { reason },
      }),
      // No tag invalidation needed when caching is disabled
    }),
    // analytics removed
  }),
})

export const {
  useGetAllHotelsQuery,
  useGetHotelByIdQuery,
  useGetHotelsBySearchQuery,
  useGetCountriesQuery,
  useGetBillingProfileQuery,
  useCreateOrUpdateBillingProfileMutation,
  useGetBookingsByUserIdQuery,
  useGetOwnerBookingsQuery,
  useCreateBookingMutation,
  useGetResultsByAiSearchQuery,
  useLazyGetResultsByAiSearchQuery,
  useCreateHotelMutation,
  useGetOwnerHotelsQuery,
  useCreateRoomMutation,
  // Admin hooks
  useGetHotelRequestsQuery,
  useApproveHotelRequestMutation,
  useRejectHotelRequestMutation
} = api