import "dotenv/config";
import express from "express";
import cors from "cors";


import healthRoutes from "./routes/healthRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

// Load environment variables from .env file (must run before using process.env)



const app = express();

// --- Global middleware ---
app.use(cors()); // Allow cross-origin requests (needed when frontend runs on a different port)
app.use(express.json()); // Parse incoming JSON request bodies

// --- API routes ---
app.use("/api/health", healthRoutes);
app.use('/api/products',productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
// --- Error handling (order matters: 404 first, then global error handler) ---
app.use(notFound);
app.use(errorHandler);

export default app;
