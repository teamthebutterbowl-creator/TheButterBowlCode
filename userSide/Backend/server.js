import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

// Load env vars before anything else that reads process.env


const PORT = process.env.PORT || 5000;

/**
 * Start the server:
 * 1. Connect to MongoDB
 * 2. Listen for HTTP requests
 */
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
};

startServer();
