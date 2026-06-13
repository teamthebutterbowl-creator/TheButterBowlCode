export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    if (req.user.role !== "admin") {
      res.status(403);
      throw new Error("Access denied: Admin only");
    }

    next();
  } catch (error) {
    next(error);
  }
};