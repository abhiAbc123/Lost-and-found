import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";      
import itemRoutes from "./routes/items.js";     
import adminRoutes from "./routes/admin.js";   
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();

const app = express();

// fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS FIX (IMPORTANT)
const allowedOrigins = [
  "http://localhost:5173",
  "https://project-omega-ruddy.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);

// test route
app.get("/", (req, res) => res.send("Lost & Found Backend Running"));

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ✅ SOCKET.IO SETUP (MAIN FIX)
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// socket events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", (msg) => {
    io.emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ❗ IMPORTANT: use server.listen NOT app.listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));




/*
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";      
import itemRoutes from "./routes/items.js";     
import adminRoutes from "./routes/admin.js";   
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS FIX
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);

app.get("/", (req, res) => res.send("Lost & Found Backend Running"));

// ✅ CREATE HTTP SERVER (IMPORTANT)
const server = http.createServer(app);

// ✅ SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: "https://project-omega-ruddy.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ✅ SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ make io available everywhere
app.set("io", io);

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ❗ IMPORTANT: use server.listen (NOT app.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

*/