import mongoose from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(chalk.green("MongoDB Connected"));
  } catch (error) {
    console.error(chalk.red("MongoDB Connection Failed:"), error);
    process.exit(1);
  }
};

export default connectDB;
