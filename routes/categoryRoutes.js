import express from "express";
import {
  createCategory,
  getCategories,
   updateCategory,
  deleteCategory,
  getProductsByCategory
} from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/",protect, createCategory);   // Admin only
router.get("/", getCategories);
router.put("/:id",protect, updateCategory);  // Admin
router.delete("/:id",protect, deleteCategory); // Admin
router.get("/by-category/:categoryId", getProductsByCategory);


export default router;
