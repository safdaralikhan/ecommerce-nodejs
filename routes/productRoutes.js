import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
   updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", createProduct); // Admin
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", protect, updateProduct);  // Admin only
router.delete("/:id", protect, deleteProduct); // Admin only

export default router;
