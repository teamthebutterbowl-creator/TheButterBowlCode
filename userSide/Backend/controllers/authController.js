import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

const JWT_EXPIRES_IN = "7d";

const signToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// @desc    Register a new user (customer)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(409);
    throw new Error("Email is already registered");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Do NOT accept role from request body (defaults to 'customer' in schema)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    ...(phone ? { phone } : {}),
  });

  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = signToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// @desc    Get logged-in user profile
// @route   GET /api/auth/me
// @access  Private (requires auth middleware)
export const getMe = asyncHandler(async (req, res) => {
  // Expected: auth middleware sets req.user = { id: <userId>, ... }
  if (!req.user?.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

