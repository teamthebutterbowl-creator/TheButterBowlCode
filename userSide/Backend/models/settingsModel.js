import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    kitchenName: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    whatsapp: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    openingHours: {
      type: String,
      trim: true,
    },

    instagram: {
      type: String,
      trim: true,
    },

    facebook: {
      type: String,
      trim: true,
    },

    youtube: {
      type: String,
      trim: true,
    },

    zomatoLink: {
      type: String,
      trim: true,
    },

    swiggyLink: {
      type: String,
      trim: true,
    },

    googleMapLink: {
      type: String,
      trim: true,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    codEnabled: {         
      type: Boolean,
      default: true,
    },
    onlinePayEnabled:{
      type:Boolean,
      default:true,
    }
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;