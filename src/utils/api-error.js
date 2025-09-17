class apiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // Capture the stack trace (useful in development)
    if (process.env.NODE_ENV === "development") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default apiError;
