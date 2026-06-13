/**
 * seed.js
 * Place at: Backend/seed.js
 *
 * Run with: node seed.js
 *
 * Categories: Bowl | Beverage | Combo | Add-On | Parantha
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js";

dotenv.config();

const products = [

  // ─── Bowl ───────────────────────────────────────────────────────────────
  {
    name: "Butter Chicken Bowl",
    description: "Slow-simmered tender chicken in a rich, creamy tomato-based makhani gravy served over steamed basmati rice. The crown jewel of North Indian cuisine.",
    price: 349,
    category: "Bowl",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
    isAvailable: true,
    isVeg: false,
    ingredients: ["Chicken", "Tomato", "Cream", "Butter", "Kasuri Methi", "Basmati Rice", "Spices"],
    tags: ["bestseller", "non-veg", "creamy"],
  },
  {
    name: "Paneer Makhani Bowl",
    description: "Silken paneer cubes in a velvety cashew and tomato gravy served over steamed basmati rice. Rich, creamy and deeply satisfying.",
    price: 299,
    category: "Bowl",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    ingredients: ["Paneer", "Tomato", "Cashew", "Cream", "Butter", "Basmati Rice", "Spices"],
    tags: ["bestseller", "veg", "creamy"],
  },
  {
    name: "Dal Makhani Bowl",
    description: "Black lentils slow-cooked overnight on a low flame with butter and cream, served over steamed basmati rice. A rich Punjabi classic.",
    price: 249,
    category: "Bowl",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    ingredients: ["Black Lentils", "Kidney Beans", "Butter", "Cream", "Tomato", "Basmati Rice", "Spices"],
    tags: ["bestseller", "veg", "lentils"],
  },
  {
    name: "Rajma Bowl",
    description: "Hearty red kidney beans in a thick, spiced tomato gravy served over fluffy steamed basmati rice. The ultimate comfort food.",
    price: 229,
    category: "Bowl",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    ingredients: ["Kidney Beans", "Tomato", "Onion", "Basmati Rice", "Spices"],
    tags: ["comfort food", "veg", "rice"],
  },
  {
    name: "Kadhai Paneer Bowl",
    description: "Wok-tossed paneer with bell peppers and onions in a bold kadhai masala served over basmati rice. Bold flavors with a smoky finish.",
    price: 279,
    category: "Bowl",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    ingredients: ["Paneer", "Bell Peppers", "Onion", "Tomato", "Kadhai Masala", "Basmati Rice"],
    tags: ["spicy", "veg", "wok-tossed"],
  },
  {
    name: "Chole Bowl",
    description: "Spicy chickpea curry in a rich onion-tomato masala served over basmati rice. A beloved Punjabi classic.",
    price: 219,
    category: "Bowl",
    image: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    ingredients: ["Chickpeas", "Tomato", "Onion", "Basmati Rice", "Spices"],
    tags: ["punjabi", "veg", "spicy"],
  },

  // ─── Parantha ───────────────────────────────────────────────────────────
  {
    name: "Aloo Parantha",
    description: "Whole wheat flatbread stuffed with spiced mashed potatoes, served with butter, pickle and fresh yogurt. A Punjabi breakfast favourite.",
    price: 129,
    category: "Parantha",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    ingredients: ["Whole Wheat Flour", "Potato", "Cumin", "Green Chili", "Coriander", "Butter"],
    tags: ["stuffed", "punjabi", "breakfast"],
  },
  {
    name: "Paneer Parantha",
    description: "Flaky whole wheat flatbread stuffed with spiced crumbled cottage cheese, served with butter and pickle.",
    price: 149,
    category: "Parantha",
    image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    ingredients: ["Whole Wheat Flour", "Paneer", "Cumin", "Green Chili", "Coriander", "Butter"],
    tags: ["stuffed", "paneer", "rich"],
  },
  {
    name: "Gobi Parantha",
    description: "Crispy whole wheat flatbread stuffed with spiced grated cauliflower, served with butter and fresh yogurt.",
    price: 129,
    category: "Parantha",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    ingredients: ["Whole Wheat Flour", "Cauliflower", "Cumin", "Ajwain", "Coriander", "Butter"],
    tags: ["stuffed", "cauliflower", "crispy"],
  },
  {
    name: "Plain Laccha Parantha",
    description: "Multi-layered whole wheat flatbread with a crispy exterior and soft flaky interior. Made fresh on the tawa with ghee.",
    price: 79,
    category: "Parantha",
    image: "https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    ingredients: ["Whole Wheat Flour", "Ghee", "Salt"],
    tags: ["layered", "crispy", "plain"],
  },

  // ─── Combo ──────────────────────────────────────────────────────────────
  {
    name: "The Butter Bowl Combo",
    description: "Our signature combo — Butter Chicken Bowl + Laccha Parantha + Sweet Lassi. Everything you need in one perfect meal.",
    price: 499,
    category: "Combo",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    isAvailable: true,
    isVeg: false,
    includes: ["Butter Chicken Bowl", "Laccha Parantha", "Sweet Lassi"],
    tags: ["combo", "bestseller", "value"],
  },
  {
    name: "Veg Delight Combo",
    description: "Dal Makhani Bowl + Aloo Parantha + Mango Lassi. A hearty all-vegetarian combo bursting with authentic flavors.",
    price: 449,
    category: "Combo",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    includes: ["Dal Makhani Bowl", "Aloo Parantha", "Mango Lassi"],
    tags: ["combo", "veg", "value"],
  },
  {
    name: "Paneer Feast Combo",
    description: "Paneer Makhani Bowl + Paneer Parantha + Masala Chai. A paneer lover's dream — rich, indulgent and complete.",
    price: 479,
    category: "Combo",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    includes: ["Paneer Makhani Bowl", "Paneer Parantha", "Masala Chai"],
    tags: ["combo", "paneer", "value"],
  },

  // ─── Add-On ─────────────────────────────────────────────────────────────
  {
    name: "Extra Rice",
    description: "A generous serving of steamed basmati rice to go alongside your bowl.",
    price: 59,
    category: "Add-On",
    image: "https://images.unsplash.com/photo-1536304993881-ff86e0c9b583?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    tags: ["add-on", "rice", "extra"],
  },
  {
    name: "Extra Gravy",
    description: "Extra serving of your choice of gravy — Butter Chicken, Paneer Makhani or Dal Makhani.",
    price: 99,
    category: "Add-On",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    tags: ["add-on", "gravy", "extra"],
  },
  {
    name: "Pickle & Papad",
    description: "Crispy papad served with mixed pickle and fresh sliced onions. The perfect side to any North Indian meal.",
    price: 49,
    category: "Add-On",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    tags: ["add-on", "side", "crispy"],
  },
  {
    name: "Fresh Salad",
    description: "Refreshing mix of cucumber, tomato, onion and carrot with a squeeze of lemon and chaat masala.",
    price: 79,
    category: "Add-On",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    tags: ["add-on", "healthy", "fresh"],
  },
  {
    name: "Dahi (Yogurt)",
    description: "Fresh, creamy homestyle yogurt. A cooling accompaniment to balance the spices.",
    price: 49,
    category: "Add-On",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    tags: ["add-on", "yogurt", "cooling"],
  },

  // ─── Beverage ───────────────────────────────────────────────────────────
  {
    name: "Sweet Lassi",
    description: "Chilled, creamy yogurt-based drink blended with sugar and a hint of cardamom. Refreshing and soul-soothing.",
    price: 99,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    ingredients: ["Yogurt", "Sugar", "Cardamom", "Rose Water"],
    tags: ["drink", "cold", "refreshing"],
  },
  {
    name: "Mango Lassi",
    description: "Rich, creamy yogurt blended with fresh Alphonso mango pulp. The king of lassis.",
    price: 129,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    ingredients: ["Yogurt", "Mango Pulp", "Sugar", "Cardamom"],
    tags: ["drink", "mango", "cold"],
  },
  {
    name: "Masala Chai",
    description: "Aromatic Indian spiced tea brewed with ginger, cardamom, cinnamon and cloves. The perfect ending to a meal.",
    price: 59,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    ingredients: ["Tea", "Milk", "Ginger", "Cardamom", "Cinnamon", "Cloves", "Sugar"],
    tags: ["drink", "hot", "spiced"],
  },
  {
    name: "Rose Sharbat",
    description: "Chilled rose-flavored drink made with fresh rose syrup, milk and sabja seeds. Cooling and beautifully fragrant.",
    price: 89,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
    isAvailable: true,
    isVeg: true,
    ingredients: ["Rose Syrup", "Milk", "Sabja Seeds", "Sugar"],
    tags: ["drink", "cold", "floral"],
  },
];

// ─── Seed function ───────────────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    console.log('Deleting existing products...');
    await Product.deleteMany({});
    console.log('Existing products deleted!');

    console.log('Inserting', products.length, 'products...');
    const inserted = await Product.insertMany(products);
    console.log('Successfully inserted', inserted.length, 'products!');

    const categories = [...new Set(products.map((p) => p.category))];
    console.log('\n--- Seeded Categories ---');
    categories.forEach((cat) => {
      const count = products.filter((p) => p.category === cat).length;
      console.log(`  ${cat}: ${count} items`);
    });

    console.log('\nSeed complete!');
    process.exit(0);

  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();