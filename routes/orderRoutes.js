import express from "express";
import { 
  placeOrder, 
  getOrders,
  adminGetAllOrders,
  adminGetOrder,
  adminUpdateOrderStatus,
  adminUpdatePaymentStatus, 
  createPaymentIntent,
  confirmPayment,
  getOrderDetails 
} from "../controllers/orderController.js";

const router = express.Router();

// PUBLIC ROUTES
router.post("/create", placeOrder);

// PAYMENT ROUTES
router.post("/create-payment-intent", createPaymentIntent);
router.post("/confirm-payment", confirmPayment);

// ORDER DETAILS
router.get("/details/:orderId", getOrderDetails);

// ADMIN ROUTES
router.get("/admin/all", adminGetAllOrders);
router.get("/admin/orders/:id", adminGetOrder);
router.put("/admin/update-status/:id", adminUpdateOrderStatus);
router.put("/admin/update-payment/:id", adminUpdatePaymentStatus);

// USER ORDERS — KEEP THIS LAST ❗
router.get("/:userId", getOrders);

export default router;
