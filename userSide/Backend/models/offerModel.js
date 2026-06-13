import mongoose from "mongoose";
import Product from "./productModel.js"
import Category from "./categoryModel.js"

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    offerType: {
      type: String,
      enum: ['seasonal', 'holiday'],
    },
    
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
    },
    
    discountValue: {
      type: Number,
    },
    
    minimumOrder: {
      type: Number,
    },
    
    maximumDiscount: {
      type: Number,
    },
    
    totalUsageLimit: {
      type: Number,
    },
    
    usagePerCustomer: {
      type: Number,
    },
    
    minimumCartValue: {
      type: Number,
    },
    scope: {
      type: String,
      enum: ['product', 'category', 'menu'],
      default: 'menu',
    },
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;