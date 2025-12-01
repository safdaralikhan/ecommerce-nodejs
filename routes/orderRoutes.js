import express from "express";
import {
  placeOrder, getOrders, adminGetAllOrders, adminGetOrder, adminUpdateOrderStatus, adminUpdatePaymentStatus, createPaymentIntent,
  confirmPayment,getOrderDetails
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", placeOrder);
router.get("/:userId", getOrders);
router.get("/admin/all", adminGetAllOrders);
router.get("/admin/orders/:id", adminGetOrder);
router.put("/admin/update-status/:id", adminUpdateOrderStatus);
router.put("/admin/update-payment/:id", adminUpdatePaymentStatus);
// Create payment intent for CARD orders (optional)
router.post("/create-payment-intent", createPaymentIntent);

// Confirm payment after Stripe payment is successful
router.post("/confirm-payment", confirmPayment);
// ⚠️ Order detail FIRST
router.get("/details/:orderId", getOrderDetails);




export default router;
