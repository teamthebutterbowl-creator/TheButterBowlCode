import mongoose from "mongoose";

const homeContentSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      trim: true,
      default: "NORTH INDIAN CUISINE",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    heroImage: {
      type: String,
      trim: true,
    },

    primaryButtonText: {
      type: String,
      trim: true,
      default: "Explore Menu",
    },

    primaryButtonLink: {
      type: String,
      trim: true,
      default: "/menu",
    },

    secondaryButtonText: {
      type: String,
      trim: true,
      default: "Our Story",
    },

    secondaryButtonLink: {
      type: String,
      trim: true,
      default: "/about",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const HomeContent = mongoose.model(
  "HomeContent",
  homeContentSchema
);

export default HomeContent;