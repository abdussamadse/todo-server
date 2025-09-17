import User from "../models/user.model.js";

const generateToken = async (userId) => {
  try {
    // Fetch the user from the database
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Generate a new token
    const token = await user.generateAuthToken();

    // Save the user without running validations
    await user.save({ validateBeforeSave: false });

    // Return the generated token
    return token;
  } catch (error) {
    console.error("Error generating token:", error.message);
    throw new Error("Failed to generate token");
  }
};

export default generateToken;
