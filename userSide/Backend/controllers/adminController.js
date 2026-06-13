import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Review from "../models/reviewModel.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Run all independent queries in parallel for speed
    const [
      todayOrders,
      pendingOrders,
      cancelledOrders,
      completedOrders,
      todayRevenue,
      todayCustomers,
    ] = await Promise.all([
      Order.countDocuments({
        createdAt: { $gte: startOfToday },
      }),
    
      Order.countDocuments({
        orderStatus: "Pending",
      }),
    
      Order.countDocuments({
        orderStatus: "Cancelled",
      }),
      Order.countDocuments({
        orderStatus:"Completed",
      }),
    
      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: { $gte: startOfToday },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),
    
      User.countDocuments({
        role: "customer",
        createdAt: { $gte: startOfToday },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        todayOrders,
        todayRevenue: todayRevenue[0]?.totalRevenue || 0,
        todayCustomers,
        pendingOrders,
        completedOrders,
        cancelledOrders,
      
       
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderStats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = {
      Pending: 0,
      Confirmed: 0,
      Preparing: 0,
      "Out For Delivery": 0,
      Delivered: 0,
      Cancelled: 0,
    };

    stats.forEach((item) => {
      formatted[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "orderNumber customerDetails.name totalAmount orderStatus paymentMethod paymentStatus createdAt"
      );

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewAnalytics = async (req, res, next) => {
  try {
    const [totalStats, ratingDistribution, topProducts] = await Promise.all([
      Review.aggregate([
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
      ]),
      Review.aggregate([
        { $group: { _id: "$rating", count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
      ]),
      Review.aggregate([
        {
          $group: {
            _id: "$productId",
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
        { $sort: { totalReviews: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const ratingMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution.forEach((r) => {
      ratingMap[r._id] = r.count;
    });

    const populatedTopProducts = await Review.populate(topProducts, {
      path: "_id",
      select: "name category",
    });

    res.status(200).json({
      success: true,
      data: {
        totalReviews: totalStats[0]?.totalReviews || 0,
        averageRating: Number(totalStats[0]?.averageRating?.toFixed(2)) || 0,
        ratingDistribution: ratingMap,
        topProducts: populatedTopProducts.map((p) => ({
          productId: p._id?._id,
          name: p._id?.name,
          category: p._id?.category,
          totalReviews: p.totalReviews,
          averageRating: Number(p.averageRating.toFixed(2)),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // FIX: original code mutated `now` with setDate, then used it for startOfToday
    // — both were pointing to the same shifted date. Now using separate Date objects.
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const [totalCustomers, newCustomersToday, newCustomersThisWeek] =
      await Promise.all([
        User.countDocuments({ role: "customer" }),
        User.countDocuments({
          role: "customer",
          createdAt: { $gte: startOfToday },
        }),
        User.countDocuments({
          role: "customer",
          createdAt: { $gte: startOfWeek },
        }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        newCustomersToday,
        newCustomersThisWeek,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductAnalytics = async (req, res, next) => {
  try {
    const [
      totalProducts,
      availableProducts,
      unavailableProducts,
      featuredProducts,
      bestSellerProducts,
      categoryWiseCount,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isAvailable: true }),
      Product.countDocuments({ isAvailable: false }),
      Product.countDocuments({ isFeatured: true }),
      Product.countDocuments({ isBestSeller: true }),
      Product.aggregate([
        {
          $group: { _id: "$category", count: { $sum: 1 } },
        },
        {
          // FIX: populate category name instead of returning raw ObjectId
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            categoryId: "$_id",
            name: { $ifNull: ["$categoryDetails.name", "Uncategorized"] },
            count: 1,
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        availableProducts,
        unavailableProducts,
        featuredProducts,
        bestSellerProducts,
        categoryWiseCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// FIX: added $lookup to populate product name + image
// Original returned raw ObjectIds — frontend had no name or image to display
export const getTopSellingProducts = async (req, res, next) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$orderedItems" },
      {
        $group: {
          _id: "$orderedItems.productId",
          totalSold: { $sum: "$orderedItems.quantity" },
          revenue: {
            $sum: {
              $multiply: ["$orderedItems.quantity", "$orderedItems.price"],
            },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      // FIX: join product details
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          totalSold: 1,
          revenue: 1,
          name: { $ifNull: ["$product.name", "Deleted Product"] },
          image: { $arrayElemAt: ["$product.images", 0] },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    next(error);
  }
};