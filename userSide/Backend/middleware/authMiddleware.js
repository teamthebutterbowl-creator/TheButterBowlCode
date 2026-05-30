import jwt from "jsonwebtoken";

/**
 * Protect middleware
 * - Reads JWT from Authorization: Bearer <token>
 * - Verifies token and attaches req.user = { id }
 * - Uses next(err) so centralized error handler responds
 */
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    if (!process.env.JWT_SECRET) {
      res.status(500);
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    // Invalid token / expired token should be a 401
    if (res.statusCode === 200) res.status(401);
    next(error);
  }
};

/**
 * Optional auth — for public routes that support both guest and logged-in users.
 * If a valid Bearer token is present, sets req.user; otherwise continues without error.
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return next();
    }

    if (!process.env.JWT_SECRET) {
      res.status(500);
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
  // Invalid token on a public route — treat as guest (do not block checkout)
    next();
  }
};

export default protect;

