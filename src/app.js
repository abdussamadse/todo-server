// Importing essential dependencies
import express from "express";
import "express-async-errors";
import cors from "cors";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import connectDB from "./db/connect-db.js";
import {
  globalErrorHandler,
  notFoundMiddleware,
} from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Establish connection to the database
connectDB();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 1000, // Max 1000 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
});

// Allowed origins for CORS
const allowedOrigins = ["*", "http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS error: Origin ${origin} not allowed`);
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    optionsSuccessStatus: 204, // Return 204 for preflight requests
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(hpp());
app.use(helmet());
app.use(mongoSanitize());
app.use(limiter);
app.use(cookieParser());

// Logging middleware for development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Define the primary route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "Welcome to backend!",
    },
  });
});

// User-related API routes
app.use("/api/v1/users", userRoutes);

// Catch all undefined routes and forward them to the error handler
app.all("*", notFoundMiddleware);

// Global error handler middleware - Handles all errors consistently
app.use(globalErrorHandler);

export default app;
