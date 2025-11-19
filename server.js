import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import homeRoutes from "./routes/homeRoutes.js"
// Routes
import stripeWebhookRoutes from "./routes/stripeWebhook.js";
connectDB();
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/webhook", stripeWebhookRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
