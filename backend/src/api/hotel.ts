import express  from 'express';
import { getAllHotels, getHotelById, generateHotelEmbedding,createHotel, getAllHotelsBySearchQuery,  } from '../application/hotel';

const HotelRouter = express.Router();


HotelRouter.get("/", getAllHotels);
HotelRouter.get("/:id", getHotelById);
HotelRouter.post("/", createHotel);
HotelRouter.post("/:id/embedding", generateHotelEmbedding);
HotelRouter.get('/search/ai', getAllHotelsBySearchQuery);

export default HotelRouter;
