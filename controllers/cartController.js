import Cart from "../models/Cart.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  try {
    const { userId, guestId, productId, qty } = req.body;

    if (!productId) {
      return res.status(400).json({
        status: false,
        message: "productId is required",
      });
    }

    // ❗ CHECK: Don’t allow both null
    if (!userId && !guestId) {
      return res.status(400).json({
        status: false,
        message: "userId or guestId is required",
      });
    }

    const quantity = qty || 1;

    let cart;

    // If user is logged in → use userId
    if (userId) {
      cart = await Cart.findOne({ userId });
    }

    // If guest user → use guestId
    if (guestId && !cart) {
      cart = await Cart.findOne({ guestId });
    }

    // ---- CREATE NEW CART ----
    if (!cart) {
      cart = await Cart.create({
        userId: userId || null,
        guestId: guestId || null,
        products: [{ productId, qty: quantity }],
      });

      return res.status(201).json({
        status: true,
        message: "Product added to new cart",
        data: cart,
      });
    }

    // ---- CHECK PRODUCT EXIST ----
    const existing = cart.products.find(
      (p) => String(p.productId) === String(productId)
    );

    if (existing) {
      existing.qty += quantity;
    } else {
      cart.products.push({ productId, qty: quantity });
    }

    await cart.save();

    return res.status(200).json({
      status: true,
      message: "Cart updated successfully",
      data: cart,
    });

  } catch (error) {
    console.log("ADD TO CART ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};



export const getCart = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "id is required",
      });
    }

    let cart = null;

    // 🟢 1) Check if ID is a valid ObjectId → User Cart
    if (mongoose.Types.ObjectId.isValid(id)) {

      cart = await Cart.findOne({ userId: id }).populate(
        "products.productId",
        "name price salePrice images category brand"
      );
    }

    // 🔵 2) If cart not found OR id is NOT ObjectId → Guest Cart
    if (!cart) {
      cart = await Cart.findOne({ guestId: id }).populate(
        "products.productId",
        "name price salePrice images category brand"
      );
    }

    // 🟠 3) No cart found → return empty cart
    return res.status(200).json({
      status: true,
      data: cart || { products: [] },
    });

  } catch (error) {
    console.error("GET CART ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while fetching cart",
      error: error.message,
    });
  }
};



export const removeFromCart = async (req, res) => {
  try {
    const { id, productId } = req.body;

    if (!id || !productId) {
      return res.status(400).json({
        status: false,
        message: "id and productId are required",
      });
    }

    // 🔍 Step 1: Try userId cart
    let cart = await Cart.findOne({ userId: id });

    // 🔍 Step 2: If not found → try guestId cart
    if (!cart) {
      cart = await Cart.findOne({ guestId: id });
    }

    // ❌ If still not found
    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "Cart not found",
      });
    }

    // 🔍 Step 3: Find product
    const index = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({
        status: false,
        message: "Product not found in cart",
      });
    }

    // 🗑️ Step 4: Remove product
    cart.products.splice(index, 1);

    // 🔄 Save
    await cart.save();

    return res.status(200).json({
      status: true,
      message: "Product removed from cart",
      data: cart,
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error removing item from cart",
      error: error.message,
    });
  }
};


// Update product quantity (+ / -)
export const updateQty = async (req, res) => {
  try {
    const { userId, productId, qty } = req.body; // qty can be +1 or -1

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ status: false, message: "Cart not found" });

    const itemIndex = cart.products.findIndex(p => p.productId == productId);
    if (itemIndex === -1) {
      return res.status(404).json({ status: false, message: "Product not in cart" });
    }

    // update qty
    cart.products[itemIndex].qty += qty;

    // auto remove if qty becomes 0
    if (cart.products[itemIndex].qty <= 0) {
      cart.products.splice(itemIndex, 1);
    }

    await cart.save();

    return res.json({
      status: true,
      message: "Cart updated",
      cart
    });

  } catch (error) {
    res.status(500).json({ status: false, message: "Error updating quantity", error });
  }
};


