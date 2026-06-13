import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * Protect middleware
 */
const protect = async (req, res, next) => {
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
      throw new Error("JWT_SECRET is not set");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    if (user.isActive === false) {
      res.status(403);
      throw new Error("User is deactivated");
    }

    req.user = user;

    next();
  } catch (error) {
    if (res.statusCode === 200) res.status(401);
    next(error);
  }
};

/**
 * Optional auth
 */
export const optionalAuth = (req, res, next) => {
  req.guestId = req.headers["x-guest-id"] || null;
  try {


    const authHeader = req.headers.authorization || "";

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    next(); // ignore invalid token
  }
};

export default protect;