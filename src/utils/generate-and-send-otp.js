import User from "../models/user.model.js";
import sendEmail from "./email-helper.js";

const generateAndSendOtp = async (email) => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error("No user exists with this email");
  }

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save({ validateBeforeSave: false });

  const subject = "Email Verification";
  const text = `Here is your OTP: ${otp} for email verification. It expires in 5 minutes.`;
  await sendEmail(email, subject, text);

  return otp;
};

export default generateAndSendOtp;
