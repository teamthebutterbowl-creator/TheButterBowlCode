import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";


import healthRoutes from "./routes/healthRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notFound from "./middleware/notFound.js";
import contactRoutes from './routes/contactRoutes.js';
import errorHandler from "./middleware/errorHandler.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import homeContentRoutes from "./routes/homeContentRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js";
import offerRoutes from "./routes/offerRoutes.js"
import couponRoutes from "./routes/couponRoutes.js";
import adminSettingsRoute from "./routes/adminSettingRoutes.js"
import feedbackRoutes from "./routes/feedbackRoutes.js"
// Load environment variables from .env file (must run before using process.env)



const app = express();

app.use(helmet()); //for necessary security

// --- Global middleware ---
app.use(cors(
    {
        origin:[
            process.env.FRONTEND_URL,
            process.env.ADMIN_DASHBOARD_URL,
        ].filter(Boolean),
        credentials: true,
    }
)); // Allow cross-origin requests (needed when frontend runs on a different port)

app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json({limit:"10kb"})); // Parse incoming JSON request bodies


const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  });
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many authentication attempts. Try again after 15 minutes.",
    },
  });
  const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many payment requests. Please try again later.",
    },
  });
  
  app.use(globalLimiter); //to prevent flood api hits 
  

// --- API routes ---
app.use("/api/health", healthRoutes);
app.use('/api/products',productRoutes);
app.use("/api/auth", authLimiter,authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminSettingsRoute);
app.use("/api/admin",adminRoutes);
app.use("/api/home-content", homeContentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/offers",offerRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/feedback",feedbackRoutes)

// --- Error handling (order matters: 404 first, then global error handler) ---
app.use(notFound);
app.use(errorHandler);

export default app;
