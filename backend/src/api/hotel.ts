import express  from 'express';
import { getAllHotels, getHotelById, generateHotelEmbedding,createHotel, getAllHotelsBySearchQuery, getOwnerHotels, createRoom  } from '../application/hotel';
import { isAuthenticated, requireRole, ROLES } from './middleware/authHandler';

const HotelRouter = express.Router();


HotelRouter.get("/", getAllHotels);
HotelRouter.get("/:id", getHotelById);
HotelRouter.post("/", createHotel);
HotelRouter.post("/:id/embedding", generateHotelEmbedding);
HotelRouter.get('/search/ai', getAllHotelsBySearchQuery);
HotelRouter.post('/createHotel', isAuthenticated,createHotel);

// Owner utilities
HotelRouter.get('/owner/my-hotels', isAuthenticated,requireRole([ROLES.HOTELOWNER]), getOwnerHotels);
HotelRouter.post('/:id/rooms', isAuthenticated,requireRole([ROLES.HOTELOWNER]), createRoom);


export default HotelRouter;
