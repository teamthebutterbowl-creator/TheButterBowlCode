import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Settings from "../models/settingsModel.js"

// @desc    Get logged-in admin profile
// @route   GET /api/admin/me
// @access  Private (admin only)
export const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.user.id).select("-password");

  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  res.status(200).json({
    success: true,
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

// @desc    Update admin name & email
// @route   PUT /api/admin/update-profile
// @access  Private (admin only)
export const updateAdminProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }

  // Check if email is already taken by another user
  const existing = await User.findOne({
    email: email.toLowerCase(),
    _id: { $ne: req.user.id },
  });

  if (existing) {
    res.status(409);
    throw new Error("Email is already in use by another account");
  }

  const admin = await User.findByIdAndUpdate(
    req.user.id,
    { name: name.trim(), email: email.toLowerCase().trim() },
    { new: true, runValidators: true }
  ).select("-password");

  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

// @desc    Change admin password
// @route   PUT /api/admin/change-password
// @access  Private (admin only)
export const changeAdminPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Both current and new password are required");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  if (currentPassword === newPassword) {
    res.status(400);
    throw new Error("New password must be different from current password");
  }

  // Need password field (select: false in schema)
  const admin = await User.findById(req.user.id).select("+password");

  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(newPassword, salt);
  await admin.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// @desc    Logout admin (client drops token; server confirms)
// @route   POST /api/admin/logout
// @access  Private (admin only)
export const logoutAdmin = asyncHandler(async (req, res) => {
  // JWT is stateless — actual logout happens on client by deleting the token.
  // Add token blacklisting here if needed in future.
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// @desc    Delete admin account permanently
// @route   DELETE /api/admin/delete-account
// @access  Private (admin only)
export const deleteAdminAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error("Password is required to delete account");
  }

  const admin = await User.findById(req.user.id).select("+password");

  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Incorrect password");
  }

  await User.findByIdAndDelete(req.user.id);

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});

// @desc    Get COD status
// @route   GET /api/admin/cod-status
// @access  Public (checkout page use karega)
export const getCODStatus = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ kitchenName: "My Kitchen" });
  }
  res.status(200).json({
    success: true,
    data: { codEnabled: settings.codEnabled },
  });
});

// @desc    Toggle COD on/off
// @route   PUT /api/admin/cod-status
// @access  Private (admin only)
export const toggleCOD = asyncHandler(async (req, res) => {
  const { enabled } = req.body;
  console.log(typeof enabled);

  if (typeof enabled !== "boolean") {
    res.status(400);
    throw new Error("'enabled' must be true or false");
  }

  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ kitchenName: "My Kitchen" });
  }

  settings.codEnabled = enabled;
  await settings.save();

  res.status(200).json({
    success: true,
    message: `COD ${enabled ? "enabled" : "disabled"} successfully`,
    data: { codEnabled: settings.codEnabled },
  });
});



//get online pay status
 //GET= api/admin/pay-online-status
export const getPayOnlineEnabled=asyncHandler(async(req,res)=>{
 let settings= await Settings.findOne()
 if(!settings){
    settings = await Settings.create({ kitchenName: "My Kitchen" });
 }
 res.status(200).json(
  {
    success:true,
    data: {onlinePayEnabled:settings.onlinePayEnabled}

  })
})

//toggle online payment 
//put api/admin/pay-online-status
export const toggleOnlinePay=asyncHandler(async(req,res)=>{
  const {enabled}=req.body
  console.log(typeof enabled);
  if(typeof enabled !=="boolean"){
    res.status(400)
    throw new Error("enabled must be true or false")
  }
  let settings = await  Settings.findOne()// if it does not exists then create new 
  if(!settings){
    settings=await Settings.create({ kitchenName: "My Kitchen" })
  }
  settings.onlinePayEnabled=enabled;
  await settings.save()
   res.status(200).json(
    {
      success:true,
      message:`PayOnline ${enabled ? "enabled" :"disabled"} successfully `,
      data:{onlinePayEnabled:settings.onlinePayEnabled}
    }
   )

})
