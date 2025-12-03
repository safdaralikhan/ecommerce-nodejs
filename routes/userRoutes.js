import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js"
import { protect } from "../middleware/authMiddleware.js";
import { getUserProfile, getUserDeliveredOrders, getUserPendingOrders } from "../controllers/orderController.js";
const router = express.Router();
// Register route
router.post("/register", registerUser);
// Login route
router.post("/login", loginUser);


// -------------------- User profile --------------------
router.get("/profile", protect, getUserProfile);

// -------------------- Delivered orders --------------------
router.get("/orders/delivered", protect, getUserDeliveredOrders);

// -------------------- Pending orders --------------------
router.get("/orders/pending", protect, getUserPendingOrders);

export default router;
