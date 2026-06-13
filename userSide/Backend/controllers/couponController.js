import Coupon from "../models/couponModel.js";

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    next(error);
  }
};

export const toggleCouponStatus = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};
// ADD this function in couponController.js
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;

    // 1. Code diya?
    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    // 2. Exist karta hai?
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "This coupon code does not exist" });
    }

    // 3. Active hai?
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: "This coupon is currently inactive" });
    }

    const now = new Date();

    // 4. Start date aa gayi?
    if (coupon.startDate && now < coupon.startDate) {
      return res.status(400).json({ success: false, message: "This coupon has not started yet" });
    }

    // 5. Expiry check (expiryDate ya endDate dono check karo)
    const expiryToCheck = coupon.expiryDate || coupon.endDate;
    if (expiryToCheck && now > expiryToCheck) {
      return res.status(400).json({ success: false, message: "This coupon has expired" });
    }

    // 6. Minimum order check
    if (coupon.minimumOrder && cartTotal < coupon.minimumOrder) {
      return res.status(400).json({
        success: false,
        message: `A minimum order value of ₹${coupon.minimumOrder} is required for this coupon`,
      });
    }

    // 7. Usage limit check
    if (coupon.totalUsageLimit && coupon.usedCount >= coupon.totalUsageLimit) {
      return res.status(400).json({ success: false, message: "This coupon's usage limit has been reached" });
    }

    // ✅ Valid — discount calculate karo
    let discountAmount = 0;

    if (coupon.type === "percentage") {
      discountAmount = (cartTotal * coupon.value) / 100;
      // maximumDiscount cap lagao
      if (coupon.maximumDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maximumDiscount);
      }
    } else if (coupon.type === "fixed") {
      discountAmount = coupon.value;
    }

    // Cart total se zyada discount nahi ho sakta
    discountAmount = Math.min(discountAmount, cartTotal);

    res.status(200).json({
      success: true,
      message: "Coupon successfully apply ho gaya!",
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount: Math.round(discountAmount),
        maximumDiscount: coupon.maximumDiscount || null,
      },
    });
  } catch (error) {
    next(error);
  }
};