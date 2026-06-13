import mongoose from "mongoose";
import dotenv from "dotenv";
import Review from "./models/reviewModel.js";

dotenv.config();

const PRODUCT_ID = "6a1f284579593d9c1b8ce8a0";

const reviews = [
  {
    productId: PRODUCT_ID,
    customerName: "Rahul Sharma",
    rating: 5,
    source: "website",
    comment: "Absolutely loved it! Fresh, flavorful and perfectly packed."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Priya Verma",
    rating: 5,
    source: "zomato",
    comment: "One of the best dishes I have tried from Butter Boat."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Amit Singh",
    rating: 4,
    source: "swiggy",
    comment: "Good taste and quantity. Could be slightly hotter on delivery."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Sneha Kapoor",
    rating: 5,
    source: "website",
    comment: "Authentic homemade taste. Will definitely order again."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Karan Mehta",
    rating: 4,
    source: "google",
    comment: "Very satisfying meal and decent portion size."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Anjali Gupta",
    rating: 5,
    source: "instagram",
    comment: "Saw it on Instagram and it exceeded my expectations."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Rohit Yadav",
    rating: 5,
    source: "website",
    comment: "Perfect balance of spices. Truly comforting food."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Pooja Arora",
    rating: 4,
    source: "whatsapp",
    comment: "Packaging was neat and food tasted fresh."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Vivek Jain",
    rating: 5,
    source: "swiggy",
    comment: "Loved every bite. Great value for money."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Neha Bansal",
    rating: 5,
    source: "zomato",
    comment: "Rich flavors and excellent quality ingredients."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Arjun Malhotra",
    rating: 4,
    source: "website",
    comment: "Tasty food and fast delivery."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Simran Kaur",
    rating: 5,
    source: "google",
    comment: "One of my favorite meals from Butter Boat."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Harsh Agarwal",
    rating: 5,
    source: "website",
    comment: "The quality has been consistently amazing."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Tanya Sharma",
    rating: 4,
    source: "instagram",
    comment: "Very delicious. Portion size was satisfactory."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Nikhil Verma",
    rating: 5,
    source: "swiggy",
    comment: "Exactly the comfort food I was craving."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Ritika Sethi",
    rating: 5,
    source: "website",
    comment: "Amazing flavor profile and very fresh ingredients."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Saurabh Khanna",
    rating: 4,
    source: "google",
    comment: "Good meal, arrived on time and well packed."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Megha Joshi",
    rating: 5,
    source: "zomato",
    comment: "The taste reminds me of homemade food."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Aditya Kapoor",
    rating: 5,
    source: "website",
    comment: "Excellent quality and worth every rupee."
  },
  {
    productId: PRODUCT_ID,
    customerName: "Ishita Malhotra",
    rating: 5,
    source: "whatsapp",
    comment: "Fresh, flavorful and beautifully presented."
  }
];

const seedReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected");

    await Review.deleteMany({
      productId: PRODUCT_ID,
    });

    console.log("Old reviews removed");

    await Review.insertMany(reviews);

    console.log(`${reviews.length} reviews inserted successfully`);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedReviews();