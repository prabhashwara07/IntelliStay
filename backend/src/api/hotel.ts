import express  from 'express';
import { getAllHotels, getHotelById, generateHotelEmbedding } from '../application/hotel';

const HotelRouter = express.Router();


HotelRouter.get("/", getAllHotels);
HotelRouter.get("/:id", getHotelById);
HotelRouter.post("/:id/embedding", generateHotelEmbedding);

export default HotelRouter;
