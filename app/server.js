// import express from "express";
// import http from "http";
// import { connect } from "mongoose";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import { authRouter } from "./routes/authRoute.js";
// import boardRouter from "./routes/boardRoute.js";
// import { listRouter } from "./routes/listRoute.js";
// import { cardRouter } from "./routes/cardRoute.js";
// import activityRouter from "./routes/activityRoute.js";

// import { initSocket } from "./socket.js";

// dotenv.config();

// const app = express();

// // ✅ CORS
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// // ✅ MIDDLEWARE
// app.use(express.json());
// app.use(cookieParser());

// // ✅ ROUTES
// app.use("/api/auth", authRouter);
// app.use("/api/board", boardRouter);
// app.use("/api/list", listRouter);
// app.use("/api/card", cardRouter);
// app.use("/api/activity", activityRouter);

// // ✅ CREATE SERVER
// const server = http.createServer(app);

// // ✅ INIT SOCKET (ONLY THIS — no duplicates)
// initSocket(server);

// // ✅ CONNECT DB + START SERVER
// const connectDB = async () => {
//   try {
//     await connect(process.env.DB_URL);
//     console.log("✅ DB Connected");

//     server.listen(3333, () => {
//       console.log("🚀 Server running on port 3333");
//     });

//   } catch (err) {
//     console.log("❌ DB Error:", err);
//   }
// };

// connectDB();

// // ✅ INVALID ROUTE
// app.use((req, res) => {
//   res.status(404).json({ message: req.url + " is invalid-path" });
// });

// // ✅ ERROR HANDLER
// app.use((err, req, res, next) => {
//   console.log("❌ Error:", err);
//   res.status(500).json({ message: err.message });
// });








import express from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// ✅ ROUTES
import { authRouter } from "./routes/authRoute.js";
import boardRouter from "./routes/boardRoute.js";
import { listRouter } from "./routes/listRoute.js";
import { cardRouter } from "./routes/cardRoute.js";
import activityRouter from "./routes/activityRoute.js";

// ✅ SOCKET
import { initSocket } from "./socket.js";

dotenv.config();

const app = express();

// ==========================
// ✅ CORS CONFIG
// ==========================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ==========================
// ✅ MIDDLEWARE
// ==========================
app.use(express.json());
app.use(cookieParser());

// ==========================
// ✅ ROUTES (VERY IMPORTANT)
// ==========================
app.use("/api/auth", authRouter);
app.use("/api/board", boardRouter);   // 🔥 MUST MATCH FRONTEND
app.use("/api/list", listRouter);
app.use("/api/card", cardRouter);
app.use("/api/activity", activityRouter);

// ==========================
// ✅ TEST ROUTE
// ==========================
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ==========================
// ✅ CREATE SERVER
// ==========================
const server = http.createServer(app);

// ==========================
// ✅ SOCKET INIT
// ==========================
initSocket(server);

// ==========================
// ✅ DATABASE CONNECTION
// ==========================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("✅ MongoDB Connected");

    server.listen(3333, () => {
      console.log("🚀 Server running on port 3333");
    });

  } catch (err) {
    console.log("❌ DB Error:", err);
  }
};

connectDB();

// ==========================
// ❌ INVALID ROUTE HANDLER
// ==========================
app.use((req, res) => {
  res.status(404).json({
    message: `${req.url} is invalid path`
  });
});

// ==========================
// ❌ GLOBAL ERROR HANDLER
// ==========================
app.use((err, req, res, next) => {
  console.log("❌ Server Error:", err);

  res.status(500).json({
    message: err.message || "Internal Server Error"
  });
});