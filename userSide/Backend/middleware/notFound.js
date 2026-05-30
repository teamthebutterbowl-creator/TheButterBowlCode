/**
 * Handles requests to routes that do not exist.
 * Creates a 404 error and passes it to the error handler.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export default notFound;
