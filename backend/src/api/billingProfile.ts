import express from "express";
import {  createOrUpdateBillingProfile, getBillingProfileByUserId } from "../application/billingProfile";
import isAuthenticated from "./middleware/authHandler";

const router = express.Router();

router.post("/",isAuthenticated, createOrUpdateBillingProfile);
router.get("/:userId",isAuthenticated, getBillingProfileByUserId);

export default router;
