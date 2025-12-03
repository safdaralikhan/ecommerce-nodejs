import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
   updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect,authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", protect, authorizeRoles("admin"), createProduct); // Admin
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", protect, authorizeRoles("admin"), updateProduct);  // Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteProduct); // Admin only

export default router;
