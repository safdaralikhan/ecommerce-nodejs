import Category from "../models/Category.js";
import slugify from "slugify";
import Product from "../models/Product.js";


export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        status: false,
        message: "Category name and image are required",
      });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({
        status: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      slug: slugify(name),
      image,
    });

    res.status(201).json({
      status: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      status: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};


// -------------------- UPDATE CATEGORY --------------------
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: false,
        message: "Category name is required",
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    category.name = name;
    category.slug = slugify(name);
    await category.save();

    res.status(200).json({
      status: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.log("UPDATE CATEGORY ERROR:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

// -------------------- DELETE CATEGORY --------------------
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      status: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log("DELETE CATEGORY ERROR:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};



export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // category details lao
    const category = await Category.findById(categoryId).select("name");

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    // sirf products lao
    const products = await Product.find({ category: categoryId });

    // har product me category name add kar do
    const updatedProducts = products.map((p) => ({
      ...p._doc,
      category: category.name,
    }));

    res.status(200).json({
      status: true,
      count: updatedProducts.length,
      data: updatedProducts,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};
