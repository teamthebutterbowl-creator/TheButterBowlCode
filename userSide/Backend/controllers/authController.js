import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/resendEmail.js";
import crypto from "crypto";
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

//forgot password feature

// @desc Forgot Password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email, role} = req.body;

  const BASE_URL=role==="admin"? process.env.ADMIN_DASHBOARD_URL:
  process.env.FRONTEND_URL

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // 1. Generate token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 2. Hash token for DB
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

  await user.save();
 
  // 3. Reset URL (frontend route)
  const resetUrl = `${BASE_URL}/reset-password/${resetToken}`;
   
  // 4. Email HTML
  const html = `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset.</p>
    <p>Click below to reset your password:</p>
    <a href="${resetUrl}" target="_blank">Reset Password</a>
    <p>This link expires in 10 minutes.</p>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html,
    });

    res.json({
      success: true,
      message: "Reset email sent successfully",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error("Email could not be sent");
  }
});

export const resendResetEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // 1. Generate new token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 2. Overwrite old token
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `
    <h2>Reset Password Link (Resent)</h2>
    <p>Click below to reset your password:</p>
    <a href="${resetUrl}" target="_blank">Reset Password</a>
    <p>This link expires in 10 minutes.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Resend Password Reset Link",
    html,
  });

  res.json({
    success: true,
    message: "Reset email resent successfully",
  });
});


// @desc Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  // hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // clear reset fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({
    success: true,
    message: "Password reset successful",
  });
});

