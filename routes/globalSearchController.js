import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const globalSearch = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ status: false, message: "Search keyword required" });
    }

    const regex = new RegExp(keyword, "i"); // case–insensitive search

    // 🔍 Search Products
    const products = await Product.find({
      $or: [{ name: regex }, { description: regex }]
    }).select("name images price");

    // 🔍 Search Categories
    const categories = await Category.find({
      name: regex
    }).select("name slug image");

    // 🔍 Search Orders by user name or shipping address
    const orders = await Order.find({
      $or: [
        { "shippingAddress.fullName": regex },
        { "shippingAddress.city": regex },
      ]
    }).select("orderStatus paymentStatus totalAmount createdAt");

    // 🔍 Search Users
    const users = await User.find({
      $or: [{ name: regex }, { email: regex }]
    }).select("name email");

    return res.status(200).json({
      status: true,
      message: "Search results",
      results: {
        products,
        categories,
        orders,
        users
      }
    });

  } catch (error) {
    console.log("SEARCH ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Search failed",
      error: error.message
    });
  }
};
