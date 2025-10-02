import express from "express";
import {  createOrUpdateBillingProfile, getBillingProfileByUserId } from "../application/billingProfile";

const router = express.Router();

router.post("/", createOrUpdateBillingProfile);
router.get("/:userId", getBillingProfileByUserId);

export default router;
