import User from "../models/userModel.js";

/**
 * Restrict route access to specific user roles (e.g. admin).
 * Must run after protect middleware so req.user.id exists.
 */
const roleMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("role");

      if (!user || !roles.includes(user.role)) {
        res.status(403);
        throw new Error("Not authorized for this action");
      }

      req.user.role = user.role;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default roleMiddleware;
