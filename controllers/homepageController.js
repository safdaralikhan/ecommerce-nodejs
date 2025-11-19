import Category from "../models/Category.js";
import Product from "../models/Product.js";

// GET /api/homepage
export const getHomepageData = async (req, res) => {
  try {
    // -------------------- Popular Categories --------------------
    const popularCategories = await Category.find()
      .sort({ name: 1 }) // alphabetical
      .limit(10); // max 10 categories

    // -------------------- New Arrivals --------------------
    const newArrivals = await Product.find()
      .sort({ createdAt: -1 }) // latest products first
      .limit(10)
      .populate("category", "name slug"); // optional, frontend convenience

    // -------------------- Best Sellers --------------------
    const bestSellers = await Product.find()
      .sort({ sold: -1 }) // most sold first
      .limit(10)
      .populate("category", "name slug"); // optional

    // -------------------- Response --------------------
    res.status(200).json({
      status: true,
      data: {
        popularCategories,
        newArrivals,
        bestSellers,
      },
    });
  } catch (error) {
    console.log("HOMEPAGE API ERROR:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};
