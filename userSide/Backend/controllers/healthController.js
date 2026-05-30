/**
 * Health check controller.
 * Used to verify the API is running (useful for monitoring and deployment).
 */

// @desc    Check API health
// @route   GET /api/health
// @access  Public
export const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Food ordering API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
};
