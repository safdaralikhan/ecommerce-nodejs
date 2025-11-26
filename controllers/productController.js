import Product from "../models/Product.js";
import Category from "../models/Category.js";
// -------------------- CREATE PRODUCT --------------------
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      salePrice,
      images,
      category,
      brand,
      stock,
      ratings,
      newArrival,
      bestSeller
    } = req.body;

    // --------- VALIDATION ---------
    if (!name || !price || !category) {
      return res.status(400).json({
        status: false,
        message: "Name, price and category are required fields.",
      });
    }

    // --------- PRODUCT CREATE ---------
    const product = await Product.create({
      name,
      description,
      price,
      salePrice: salePrice || null,
      images: images || [],
      category,
      brand: brand || null,
      stock: stock || 0,
      ratings: ratings || 0,
      newArrival: newArrival || false,
      bestSeller: bestSeller || false,
    });

    return res.status(201).json({
      status: true,
      message: "Product created successfully",
      data: product,
    });

  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while creating product",
    });
  }
};


export const getProducts = async (req, res) => {
  try {
    // Populate category ka name
    const products = await Product.find().populate("category", "name");

    const updatedProducts = products.map(p => ({
      ...p._doc,
      category: p.category ? p.category.name : null, // <- null check
    }));

    res.status(200).json({
      status: true,
      data: updatedProducts,
    });
  } catch (error) {
    res.status(500).json({ 
      status: false,
      message: "Error fetching products", 
      error: error.message 
    });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
         res.status(200).json({
      status: true,
      data: product,
    });
  } catch (error) {
    res.status(404).json({ message: "Product not found" });
  }
};



// -------------------- UPDATE PRODUCT --------------------
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, description, price, salePrice, images, category, brand, stock, ratings, newArrival, bestSeller } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    // Agar category name diya hai → uska ObjectId find karo
    if (category) {
      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        return res.status(400).json({ status: false, message: "Category not found" });
      }
      category = categoryDoc._id; // replace name with ObjectId
    }

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.salePrice = salePrice || product.salePrice;
    product.images = images || product.images;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.stock = stock || product.stock;
    product.ratings = ratings || product.ratings;
    product.newArrival = newArrival !== undefined ? newArrival : product.newArrival;
    product.bestSeller = bestSeller !== undefined ? bestSeller : product.bestSeller;

    await product.save();

    res.status(200).json({
      status: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.log("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// -------------------- DELETE PRODUCT --------------------
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("DELETE PRODUCT ERROR:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};


