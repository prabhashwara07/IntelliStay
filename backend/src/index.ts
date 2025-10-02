import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import errorHandler from "./api/middleware/errorHandler";
import HotelRouter from "./api/hotel";
import LocationRouter from "./api/location";
import connectDB from "./infrastructure/database";
import BillingProfileRouter from "./api/billingProfile";

// Load environment variables first
dotenv.config();

const app: express.Express = express();

app.use(express.json());

app.use(cors(
  {
    origin: "http://localhost:5173",
  }
));
app.use(clerkMiddleware());

app.use("/hotels", HotelRouter);
app.use("/locations", LocationRouter);
app.use("/billing-profiles", BillingProfileRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});