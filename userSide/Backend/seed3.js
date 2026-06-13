import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

// Pehle delete karo agar exist karta hai
await User.deleteOne({ email: "mishakshita2006@gmail.com" });

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash("Admin@123", salt);

const admin = await User.create({
  name: "Admin",
  email: "mishakshita2006@gmail.com",
  password: hashedPassword,
  role: "admin",
});

console.log("✅ Admin created:", admin.email, "| role:", admin.role);
process.exit(0);