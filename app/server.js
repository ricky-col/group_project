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

// routes
import { authRouter } from "./routes/authRoute.js";
import boardRouter from "./routes/boardRoute.js";
import { listRouter } from "./routes/listRoute.js";
import { cardRouter } from "./routes/cardRoute.js";
import activityRouter from "./routes/activityRoute.js";

// socket
import { initSocket } from "./socket.js";

dotenv.config();

const app = express();

// cors
app.use(
  cors({
    origin: ["http://localhost:5173","https://group-project-1ep9.onrender.com"],
    credentials: true,
  })
);

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/board", boardRouter);
app.use("/api/list", listRouter);
app.use("/api/card", cardRouter);
app.use("/api/activity", activityRouter);

// test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const server = http.createServer(app);
initSocket(server);

// connect to db and start server
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("MongoDB Connected");

    server.listen(3333, () => {
      console.log("Server running on port 3333");
    });

  } catch (err) {
    console.log("DB Error:", err);
  }
};

connectDB();

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: `${req.url} is invalid path`
  });
});

// error handler
app.use((err, req, res, next) => {
  console.log("Server Error:", err);

  res.status(500).json({
    message: err.message || "Internal Server Error"
  });
});