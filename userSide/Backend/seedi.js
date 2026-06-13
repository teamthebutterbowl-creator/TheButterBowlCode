/**
 * seed.js
 * Place at: Backend/seed.js
 * Run: node seed.js
 *
 * Pehle categories create karta hai, phir unke IDs se products seed karta hai.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// ─── Models ──────────────────────────────────────────────────────────────────
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, trim: true, lowercase: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

const productSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    description:  { type: String, trim: true },
    price:        { type: Number, required: true },
    category:     { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    images:       [String],
    isAvailable:  { type: Boolean, default: true },
    isVeg:        { type: Boolean, default: true },
    isFeatured:   { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    tags:         [String],
    includes:     [String],
    ingredients:  [String],
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// ─── Seed data ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Bowl",      slug: "bowl",      displayOrder: 1 },
  { name: "Parantha",  slug: "parantha",  displayOrder: 2 },
  { name: "Beverage",  slug: "beverage",  displayOrder: 3 },
  { name: "Combo",     slug: "combo",     displayOrder: 4 },
];

// Products use free Unsplash food images (no auth needed)
const getProducts = (cats) => {
  const bowl     = cats.find((c) => c.name === "Bowl")._id;
  const parantha = cats.find((c) => c.name === "Parantha")._id;
  const beverage = cats.find((c) => c.name === "Beverage")._id;
  const combo    = cats.find((c) => c.name === "Combo")._id;

  return [
    // ── Bowls ──────────────────────────────────────────────────────────────
    {
      name: "Dal Makhani Bowl",
      description: "Slow-cooked black lentils in rich tomato-butter gravy, served with steamed rice.",
      price: 199,
      category: bowl,
      images: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80"],
      isVeg: true,
      isBestSeller: true,
      tags: ["lentils", "butter", "rice"],
      ingredients: ["Black Dal", "Butter", "Cream", "Tomato", "Basmati Rice"],
    },
    {
      name: "Paneer Butter Masala Bowl",
      description: "Cottage cheese cubes in velvety tomato-cashew gravy with jeera rice.",
      price: 229,
      category: bowl,
      images: ["https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80"],
      isVeg: true,
      isFeatured: true,
      tags: ["paneer", "butter", "masala"],
      ingredients: ["Paneer", "Tomato", "Cashew", "Cream", "Jeera Rice"],
    },
    {
      name: "Chhole Bowl",
      description: "Punjabi-style spiced chickpeas with bhature-crumble topping and pickled onions.",
      price: 179,
      category: bowl,
      images: ["https://images.unsplash.com/photo-1626132647523-66c9f5a3e7c4?w=600&q=80"],
      isVeg: true,
      tags: ["chickpeas", "punjabi", "spicy"],
      ingredients: ["Chickpeas", "Onion", "Tomato", "Spices"],
    },
    {
      name: "Rajma Chawal Bowl",
      description: "Classic kidney bean curry over fluffy basmati — Delhi's ultimate comfort food.",
      price: 169,
      category: bowl,
      images: ["https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600&q=80"],
      isVeg: true,
      isBestSeller: true,
      tags: ["rajma", "rice", "comfort"],
      ingredients: ["Kidney Beans", "Onion", "Tomato", "Basmati Rice"],
    },

    // ── Paranthas ──────────────────────────────────────────────────────────
    {
      name: "Aloo Parantha",
      description: "Crispy whole-wheat flatbread stuffed with spiced mashed potato, served with white butter & pickle.",
      price: 129,
      category: parantha,
      images: ["https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&q=80"],
      isVeg: true,
      isBestSeller: true,
      tags: ["potato", "classic", "breakfast"],
      ingredients: ["Whole Wheat", "Potato", "Green Chilli", "Coriander", "White Butter"],
    },
    {
      name: "Paneer Parantha",
      description: "Flaky flatbread loaded with herbed cottage cheese filling, pan-fried in desi ghee.",
      price: 149,
      category: parantha,
      images: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80"],
      isVeg: true,
      isFeatured: true,
      tags: ["paneer", "ghee", "stuffed"],
      ingredients: ["Whole Wheat", "Paneer", "Coriander", "Spices", "Ghee"],
    },
    {
      name: "Mooli Parantha",
      description: "Winter-special grated radish parantha with carom seeds — light yet deeply satisfying.",
      price: 119,
      category: parantha,
      images: ["https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80"],
      isVeg: true,
      tags: ["radish", "winter", "light"],
      ingredients: ["Whole Wheat", "Radish", "Ajwain", "Green Chilli"],
    },
    {
      name: "Gobhi Parantha",
      description: "Spiced grated cauliflower stuffed inside golden parantha, finished with a dollop of butter.",
      price: 129,
      category: parantha,
      images: ["https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&q=80"],
      isVeg: true,
      tags: ["cauliflower", "butter", "stuffed"],
      ingredients: ["Whole Wheat", "Cauliflower", "Spices", "Butter"],
    },

    // ── Beverages ──────────────────────────────────────────────────────────
    {
      name: "Sweet Lassi",
      description: "Chilled hand-churned yoghurt drink with a hint of rose water and cardamom.",
      price: 89,
      category: beverage,
      images: ["https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80"],
      isVeg: true,
      isBestSeller: true,
      tags: ["lassi", "sweet", "cold"],
      ingredients: ["Yoghurt", "Sugar", "Rose Water", "Cardamom"],
    },
    {
      name: "Masala Chaas",
      description: "Spiced thin buttermilk with roasted cumin, mint and a pinch of black salt.",
      price: 69,
      category: beverage,
      images: ["https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80"],
      isVeg: true,
      tags: ["buttermilk", "spiced", "digestive"],
      ingredients: ["Yoghurt", "Cumin", "Mint", "Black Salt"],
    },
    {
      name: "Mango Lassi",
      description: "Thick Alphonso mango pulp blended with creamy yoghurt — sunshine in a glass.",
      price: 109,
      category: beverage,
      images: ["https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80"],
      isVeg: true,
      isFeatured: true,
      tags: ["mango", "lassi", "summer"],
      ingredients: ["Alphonso Mango", "Yoghurt", "Sugar", "Cardamom"],
    },

    // ── Combos ────────────────────────────────────────────────────────────
    {
      name: "Dal + Parantha Combo",
      description: "Dal Makhani bowl paired with two Aloo Paranthas and a glass of Masala Chaas.",
      price: 349,
      category: combo,
      images: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80"],
      isVeg: true,
      isFeatured: true,
      isBestSeller: true,
      tags: ["combo", "value", "complete meal"],
      includes: ["Dal Makhani Bowl", "2× Aloo Parantha", "Masala Chaas"],
    },
    {
      name: "Paneer Feast Combo",
      description: "Paneer Butter Masala bowl with two Paneer Paranthas and a Sweet Lassi.",
      price: 429,
      category: combo,
      images: ["https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80"],
      isVeg: true,
      isFeatured: true,
      tags: ["combo", "paneer", "feast"],
      includes: ["Paneer Butter Masala Bowl", "2× Paneer Parantha", "Sweet Lassi"],
    },
    {
      name: "Budget Thali Combo",
      description: "Rajma Chawal bowl with one Gobhi Parantha and Masala Chaas — hearty and easy on the pocket.",
      price: 279,
      category: combo,
      images: ["https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600&q=80"],
      isVeg: true,
      tags: ["combo", "budget", "thali"],
      includes: ["Rajma Chawal Bowl", "1× Gobhi Parantha", "Masala Chaas"],
    },
  ];
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(`mongodb+srv://ellobroh_db_user:u4kFm0ZD8hf5LEDg@cluster0.6fbg9gs.mongodb.net/?appName=Cluster0`);
    console.log("✅ MongoDB connected");

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("🗑️  Cleared existing products and categories");

    // Insert categories
    const insertedCategories = await Category.insertMany(CATEGORIES);
    console.log(`✅ ${insertedCategories.length} categories inserted`);

    // Insert products
    const products = getProducts(insertedCategories);
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ ${insertedProducts.length} products inserted`);

    console.log("\n🎉 Seed complete!");
    console.log("Categories:", insertedCategories.map((c) => `${c.name} (${c._id})`).join(", "));

  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
};

seed();