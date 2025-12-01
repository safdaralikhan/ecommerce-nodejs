import express from "express";
import { stripeWebhook } from "../controllers/Stripewebhook.js";

const router = express.Router();

// IMPORTANT → express.json nahi chalega yahan
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
