import { z } from 'zod';

export const CreateRoomDTO = z.object({
  hotelId: z.string().min(1, 'Hotel ID is required'),
  roomNumber: z.string().min(1, 'Room number is required'),
  roomType: z.enum(['Single', 'Double', 'Suite'], { required_error: 'Room type is required' }),
  pricePerNight: z.number().positive('Price must be greater than 0'),
  maxGuests: z.number().int().min(1, 'Max guests must be at least 1'),
  isAvailable: z.boolean().optional().default(true),
});

export type CreateRoom = z.infer<typeof CreateRoomDTO>;


