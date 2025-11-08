import express  from 'express';
import { Types } from 'mongoose';
import { getAllHotels, getHotelById, generateHotelEmbedding,createHotel, getAllHotelsBySearchQuery, getOwnerHotels, createRoom  } from '../application/hotel';
import { getHotelReviews } from '../application/review';
import { isAuthenticated, requireRole, ROLES } from './middleware/authHandler';

const HotelRouter = express.Router();


HotelRouter.get("/", getAllHotels);
HotelRouter.get('/search/ai', getAllHotelsBySearchQuery);
HotelRouter.get('/:id/reviews', getHotelReviews);
HotelRouter.get("/:id", getHotelById);
HotelRouter.post("/:id/embedding", generateHotelEmbedding);
HotelRouter.post('/createHotel', isAuthenticated, createHotel);

// Owner utilities
HotelRouter.get('/owner/my-hotels', isAuthenticated,requireRole([ROLES.HOTELOWNER]), getOwnerHotels);
HotelRouter.post('/:id/rooms', isAuthenticated,requireRole([ROLES.HOTELOWNER]), createRoom);


export default HotelRouter;
