import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";

// Create HTTP server
const server = createServer(app);

// Attach socket.io
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL,process.env.ADMIN_DASHBOARD_URL,process.env.CLIENT_URL,"https://www.thebutterbowl.in"],
    credentials: true,
  },
});

// make io accessible everywhere
app.set("io", io);

// socket connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// connect DB + start server
const startServer = async () => {
  try{
  await connectDB();

  server.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
  });
}catch(error){
  console.error("Database connection failed:", error);  //if db connection fails 
  process.exit(1);
}
};

startServer();
