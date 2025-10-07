"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomDTO = void 0;
const zod_1 = require("zod");
exports.CreateRoomDTO = zod_1.z.object({
    hotelId: zod_1.z.string().min(1, 'Hotel ID is required'),
    roomNumber: zod_1.z.string().min(1, 'Room number is required'),
    roomType: zod_1.z.enum(['Single', 'Double', 'Suite'], { required_error: 'Room type is required' }),
    pricePerNight: zod_1.z.number().positive('Price must be greater than 0'),
    maxGuests: zod_1.z.number().int().min(1, 'Max guests must be at least 1'),
    isAvailable: zod_1.z.boolean().optional().default(true),
});
//# sourceMappingURL=RoomDTO.js.map