import Product from "../models/Product.js";

export const globalSearch = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ status: false, message: "Search keyword required" });
    }

    // Exact match (case-insensitive)
    const regex = new RegExp(`^${keyword}$`, "i");

    // Search Products only
    const products = await Product.find({ name: regex }).select("name images price");

    return res.status(200).json({
      status: true,
      message: "Search results",
      results: {
        products
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
