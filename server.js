import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import SearchRoutes from "./routes/SearchRoutes.js";
import stripeWebhookRoutes from "./routes/stripeWebhook.js";

// =================== DATABASE CONNECT ===================
connectDB();

// =================== EXPRESS APP ===================
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =================== CORS ===================
const allowedOrigins = [
  "https://ecommerce-frontend-pied-two.vercel.app",
  "http://localhost:3000",
  "https://ecommerce-nodejs-production-4abd.up.railway.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// =================== SOCKET.IO INITIALIZATION ===================
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// =================== SOCKET.IO LOGIC ===================
io.on("connection", (socket) => {
  console.log("🔥 User Connected:", socket.id);

  // -------------------- USER JOIN ROOM --------------------
  socket.on("joinUser", (userId) => {
    console.log("🟢 User joined room:", userId);
    socket.join(userId);
  });

  // -------------------- ADMIN JOIN ROOM --------------------
  socket.on("joinAdmin", () => {
    console.log("🟣 Admin joined ADMIN ROOM");
    socket.join("adminRoom");
  });

  // -------------------- TEST EVENT --------------------
  socket.on("test", () => {
    console.log("🔥 Test event received from client");
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// =================== ROUTES ===================
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/search", SearchRoutes);
app.use("/api/webhook", stripeWebhookRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running with Socket.io...");
});

// =================== SERVER LISTEN ===================
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
