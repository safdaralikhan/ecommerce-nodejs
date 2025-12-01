import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import homeRoutes from "./routes/homeRoutes.js"
import SearchRoutes from "./routes/SearchRoutes.js"
// Routes
import stripeWebhookRoutes from "./routes/stripeWebhook.js";

connectDB();
const app = express();
// / Enable JSON body parsing
app.use(express.json()); // <--- Yeh zaroori hai
app.use(express.urlencoded({ extended: true })); // optional, form data ke liye
app.use(cors({
  origin: [
    "https://ecommerce-frontend-pied-two.vercel.app",
    "http://localhost:3000",
     "https://ecommerce-nodejs-production-4abd.up.railway.app"
    
    ], 
  credentials: true,
}));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/search", SearchRoutes);
app.use("/api/webhook", stripeWebhookRoutes);





// Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
