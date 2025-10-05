import z from "zod";

export const SearchHotelDTO = z.object({
  query: z.string().min(1),
});
