import express from "express";
import { addToCart, getCart,removeFromCart,updateQty } from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:id", getCart);
router.delete("/remove", removeFromCart);
router.put("/update-qty", updateQty);



export default router;
