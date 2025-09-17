import User from "../models/user.model.js";
import generateAndSendOtp from "../utils/generate-and-send-otp.js";
import apiError from "../utils/api-error.js";
import catchAsync from "../utils/catch-async.js";
import generateToken from "../utils/generate-token.js";
import bcrypt from "bcryptjs";
import { cloudinaryImageUpload } from "../utils/cloudinary.js";

// Register a new user
export const registerUser = catchAsync(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new apiError("All fields are required", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new apiError("Email already exists", 409);
  }

  const user = await User.create({ fullName, email, password });

  const createdUser = await User.findById(user._id).select(
    "-password -otp -otpExpires -resetPasswordToken -resetPasswordExpires"
  );

  if (!createdUser) {
    throw new apiError("Failed to create user", 500);
  }

  await generateAndSendOtp(email);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: createdUser,
  });
});

// Verify email
export const verifyEmail = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new apiError("Email and OTP are required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError("User not found", 404);
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    throw new apiError("Invalid or expired OTP", 400);
  }

  user.otp = null;
  user.otpExpires = null;
  user.status = "active";
  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: { userId: user._id },
  });
});

// Resend OTP
export const resendOtp = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new apiError("Email is required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError("User not found", 404);
  }

  await generateAndSendOtp(email);

  res.status(200).json({
    success: true,
    message: "OTP resent successfully",
  });
});

// Login user
export const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError("User not found", 404);
  }

  // Check if user is active (verified email)
  if (user.status !== "active") {
    if (user.status === "inactive") {
      return res.status(403).json({
        message:
          "Your account is inactive. Please verify you email or contact support for assistance.",
        isEmailVerified: false,
      });
    }
    if (user.status === "blocked") {
      return res.status(403).json({
        message:
          "Your account has been blocked. Please contact support for assistance.",
      });
    }
  }

  // Validate password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new apiError("Invalid email or password", 401);
  }

  // Generate tokens for active users
  const token = await generateToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -otp -otpExpires -resetPasswordExpires -resetPasswordToken"
  );

  const option = {
    httpOnly: false,
    secure: false,
  };

  return res.status(200).cookie("token", token, option).json({
    success: true,
    message: "Login successful",
    isEmailVerified: true,
    token: token,
    data: loggedInUser,
  });
});

// Logout user
export const logoutUser = catchAsync(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Forget password
export const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new apiError("Email is required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError("User not found", 404);
  }

  // Send OTP for password reset
  await generateAndSendOtp(email);

  res.status(200).json({
    success: true,
    message: "OTP sent to your email",
  });
});

// Verify OTP for password reset
export const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new apiError("Email and OTP are required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError("User not found", 404);
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    throw new apiError("Invalid or expired OTP", 400);
  }

  // Generate reset password token
  user.resetPasswordToken = user.generatePasswordResetToken();
  user.resetPasswordExpires = Date.now() + 300000; // Token valid for 5 minutes

  // Clear OTP after verification
  user.otp = null; // Clear OTP after verification
  user.otpExpires = null; // Clear OTP expiration after verification

  // Save user with reset password token
  await user.save();

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    resetPasswordToken: user.resetPasswordToken,
  });
});

// Reset password
export const resetPassword = catchAsync(async (req, res) => {
  const { email, newPassword, resetPasswordToken } = req.body;

  if (!email || !newPassword || !resetPasswordToken) {
    throw new apiError(
      "Email, new password, and reset token are required",
      400
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError("User not found", 404);
  }

  // Check if reset token is valid
  if (
    user.resetPasswordToken !== resetPasswordToken ||
    user.resetPasswordExpires < Date.now()
  ) {
    throw new apiError("Invalid or expired reset token", 400);
  }

  // Check if new password is the same as old password
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new apiError(
      "New password cannot be the same as the old password",
      400
    );
  }

  // Update password
  user.password = newPassword;
  user.resetPasswordToken = null; // Clear reset token after use
  user.resetPasswordExpires = null; // Clear expiration after use

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

// Change password
export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new apiError("Current password and new password are required", 400);
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new apiError("User not found", 404);
  }

  // Validate current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new apiError("Current password is incorrect", 401);
  }

  // Check if new password is the same as old password
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new apiError(
      "New password cannot be the same as the old password",
      400
    );
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// Get user profile
export const getUserProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -otp -otpExpires -resetPasswordToken -resetPasswordExpires"
  );
  if (!user) {
    throw new apiError("User not found", 404);
  }
  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    data: user,
  });
});

// Update user profile
export const updateUserProfile = catchAsync(async (req, res) => {
  const { fullName, bio, designation } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new apiError("User not found", 404);
  }

  user.fullName = fullName || user.fullName;
  user.bio = bio || user.bio;
  user.designation = designation || user.designation;

  await user.save();

  res.status(200).json({
    success: true,
    message: "User profile updated successfully",
  });
});

// Upload user avatar
export const uploadUserAvatar = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new apiError("No file uploaded", 400);
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new apiError("User not found", 404);
  }

  // Upload image to Cloudinary using buffer
  const result = await cloudinaryImageUpload(
    req.file.buffer,
    `avatar_${user._id}`,
    "avatars"
  );

  user.avatar = result.secure_url;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Avatar uploaded successfully",
    data: { avatar: user.avatar },
  });
});

// Get all users (for admin use)
export const getAllUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const users = await User.find({ role: "employee" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .select(
      "-password -otp -otpExpires -resetPasswordToken -resetPasswordExpires"
    );

  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / limit);

  if (users.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No users found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    data: users,
    pagination: {
      totalUsers,
      totalPages,
      currentPage: Number(page),
    },
  });
});

// Get user by ID (for admin use)
export const getUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new apiError("User ID is required", 400);
  }

  const user = await User.findById(userId).select(
    "-password -otp -otpExpires -resetPasswordToken -resetPasswordExpires"
  );
  if (!user) {
    throw new apiError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});

// Delete user (for admin use)
export const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new apiError("User ID is required", 400);
  }

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new apiError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// Change email

