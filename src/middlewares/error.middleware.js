import apiError from "../utils/api-error.js";

export const notFoundMiddleware = (req, res, next) => {
  next(new apiError(`Cannot find ${req.originalUrl} on this server`, 404));
};

export const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "An unexpected error occurred";

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join(", ");
  }

  // Optional: CastError (bad MongoDB ID)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  res.status(statusCode).json({
    status: err.status || "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
