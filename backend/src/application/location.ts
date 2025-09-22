import { Request, Response, NextFunction } from "express";
import Location from "../infrastructure/entities/Location";

export const getCountries = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const countries: string[] = await Location.distinct("country");
    countries.sort((a, b) => a.localeCompare(b));
    res.status(200).json(countries);
  } catch (error) {
    next(error);
  }
};


