import express from "express";
import { getHomepageData } from "../controllers/homepageController.js";

const router = express.Router();

router.get("/", getHomepageData); // public route, token not needed

export default router;
