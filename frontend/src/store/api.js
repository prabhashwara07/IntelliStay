import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/',
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
  tagTypes: ['Hotels'],
  endpoints: (build) => ({
    getAllHotels: build.query({
      query: (country) => country && country.length > 0
        ? `hotels?country=${encodeURIComponent(country)}`
        : 'hotels',
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
  }),
})

export const {
  useGetAllHotelsQuery,
  useGetHotelByIdQuery,
  useGetHotelsBySearchQuery,
  useGetCountriesQuery,
} = api


