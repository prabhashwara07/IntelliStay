"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotel_1 = require("../application/hotel");
const authHandler_1 = require("./middleware/authHandler");
const HotelRouter = express_1.default.Router();
HotelRouter.get("/", hotel_1.getAllHotels);
HotelRouter.get("/:id", hotel_1.getHotelById);
HotelRouter.post("/", hotel_1.createHotel);
HotelRouter.post("/:id/embedding", hotel_1.generateHotelEmbedding);
HotelRouter.get('/search/ai', hotel_1.getAllHotelsBySearchQuery);
HotelRouter.post('/createHotel', authHandler_1.isAuthenticated, hotel_1.createHotel);
// Owner utilities
HotelRouter.get('/owner/my-hotels', authHandler_1.isAuthenticated, (0, authHandler_1.requireRole)([authHandler_1.ROLES.HOTELOWNER]), hotel_1.getOwnerHotels);
HotelRouter.post('/:id/rooms', authHandler_1.isAuthenticated, (0, authHandler_1.requireRole)([authHandler_1.ROLES.HOTELOWNER]), hotel_1.createRoom);
exports.default = HotelRouter;
//# sourceMappingURL=hotel.js.map