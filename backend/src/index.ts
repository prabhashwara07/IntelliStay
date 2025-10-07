import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./infrastructure/database";
import errorHandler from "./api/middleware/errorHandler";


import HotelRouter from "./api/hotel";
import LocationRouter from "./api/location";
import BillingProfileRouter from "./api/billingProfile";
import BookingsRouter from "./api/booking";
import AdminRouter from "./api/admin";


// Load environment variables first
dotenv.config();

const app: express.Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this for PayHere form data

app.use(cors(
  {
    origin: process.env.FRONTEND_URL,
  }
));
app.use(clerkMiddleware());

app.use("/hotels", HotelRouter);
app.use("/locations", LocationRouter);
app.use("/billing-profile", BillingProfileRouter);
app.use("/bookings", BookingsRouter);
app.use("/admin", AdminRouter);
 


app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});