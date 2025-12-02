import express from "express";
import {
  createCategory,
  getCategories,
   updateCategory,
  deleteCategory,
  getProductsByCategory
} from "../controllers/categoryController.js";
import { protect ,authorizeRoles} from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/",protect, authorizeRoles("admin"), createCategory);   // Admin only
router.get("/", getCategories);
router.put("/:id",protect, authorizeRoles("admin"), updateCategory);  // Admin
router.delete("/:id",protect, authorizeRoles("admin"), deleteCategory); // Admin
router.get("/by-category/:categoryId", getProductsByCategory);

export default router;
