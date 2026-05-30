/**
 * Centralized error handler middleware.
 * Must be registered AFTER all routes in app.js.
 *
 * Catches errors passed via next(err) and sends a consistent JSON response.
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if status code is not set on the error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only expose stack trace in development for easier debugging
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
