import express from "express";
import { getDashboardStats ,
    getOrderStats,
    getReviewAnalytics,
    getCustomerAnalytics,
    getProductAnalytics,
    getTopSellingProducts,
    getRecentOrders,

} from "../controllers/adminController.js";

import protect from "../middleware/authMiddleware.js";
import {adminOnly} from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardStats
);

// order analytics
router.get(
    "/orders/stats",
    protect,
   adminOnly,
    getOrderStats
  );
  
  router.get(
    "/orders/recent",
    protect,
    adminOnly,
    getRecentOrders
  );
  //review analytics route
  router.get(
    "/reviews",
    protect,
    adminOnly,
    getReviewAnalytics
  );

  // CUSTOMER ANALYTICS
// --------------------
router.get(
    "/customers",
    protect,
    adminOnly,
    getCustomerAnalytics
  );

  // --------------------
// PRODUCT ANALYTICS
// --------------------
router.get(
    "/products",
    protect,
    adminOnly,
    getProductAnalytics
  );
  // --------------------
// TOP SELLING PRODUCTS
// --------------------
router.get(
    "/products/top-selling",
    protect,
    adminOnly,
    getTopSellingProducts
  );

export default router;