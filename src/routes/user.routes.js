import express from "express";

// Import user controller functions
import {
  changePassword,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getUserById,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  resendOtp,
  resetPassword,
  updateUserProfile,
  uploadUserAvatar,
  verifyEmail,
  verifyOtp,
} from "../controllers/user.controller.js";

// Import schema for validation
import {
  changePasswordSchema,
  forgetPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resendOtpSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyEmailSchema,
  verifyOtpSchema,
} from "../validations/auth.validation.js";

// Import validation middleware
import { validate } from "../middlewares/validate.middleware.js";

// Import authentication middleware
import { protect } from "../middlewares/auth.middleware.js";

// Import file upload middleware
import { uploadSingle } from "../middlewares/multer.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

// Create a new router instance
const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUser); // User registration
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail); // Email verification
router.post("/resend-otp", validate(resendOtpSchema), resendOtp); // Resend OTP
router.post("/login", validate(loginUserSchema), loginUser); // User login
router.post("/logout", logoutUser); // User logout
router.post("/forgot-password", validate(forgetPasswordSchema), forgetPassword); // Forget password
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp); // Verify OTP
router.post("/reset-password", validate(resetPasswordSchema), resetPassword); // Reset password
router.post("/change-password", protect, validate(changePasswordSchema), changePassword); // Change password
router.get("/profile", protect, getUserProfile); // Get user profile
router.put("/profile", protect, validate(updateProfileSchema), updateUserProfile); // Update user profile
router.put("/avatar", protect, uploadSingle("avatar"), uploadUserAvatar); // Update user avatar
router.get("/", protect, verifyAdmin, getAllUsers); // Get all users (admin only)
router.get("/:userId", protect, verifyAdmin, getUserById); // Get user by id (admin only)
router.delete("/:userId", protect, verifyAdmin, deleteUser); // Delete user by id (admin only)

// Export the router to be used in the main app
export default router;
