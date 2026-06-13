import mongoose from "mongoose";

/**
 * Line item snapshot at checkout time.
 * Stores name and price so the order history stays accurate if the menu changes later.
 */
const orderedItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Item price is required"],
      min: [0, "Item price cannot be negative"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { _id: false }
);

/**
 * Order schema — supports guest checkout and logged-in users.
 * Guest orders omit `user`; logged-in orders link to the User document.
 */
const orderSchema = new mongoose.Schema(
  {
    // Human-readable order reference (auto-generated before first save)
    orderNumber: {
      type: String,
      unique: true,
    },
    orderedItems: {
      type: [orderedItemSchema],
      required: [true, "Order must contain at least one item"],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: "Order must contain at least one item",
      },
    },
    customerDetails: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Customer phone is required"],
        trim: true,
      },
      address: {
        type: String,
        required: [true, "Delivery address is required"],
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        default: null,
      },
    },
    // Set only when the customer is logged in; omitted for guest checkout
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: {
        values: ["COD", "ONLINE"],
        message: "Payment method must be COD or ONLINE",
      },
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["pending", "paid", "failed","processing"],
        message: "Payment status must be pending, paid, or failed",
      },
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: {
        values: [
          "Pending",
          "Confirmed",
          "Preparing",
          "Out For Delivery",
          "Delivered",
          "Cancelled",
        ],
        message: "Invalid order status",
      },
      default: "Pending",
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    // --- OFFERS & COUPONS ---
    appliedOffer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      default: null,
    },
    appliedCoupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    offerDiscount: {
      type: Number,
      default: 0,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      default: 0,
    },

    guestId: {
      type: String,
      index: true,
      default: null,
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// FIX: added next() — without it save() hangs forever
orderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
  }

});

const Order = mongoose.model("Order", orderSchema);

export default Order;