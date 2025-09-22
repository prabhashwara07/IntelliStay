import express from 'express';
import { getCountries } from '../application/location';

const LocationRouter = express.Router();

LocationRouter.get('/countries', getCountries);

export default LocationRouter;


