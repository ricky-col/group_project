import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://group-project-1ep9.onrender.com"],
      credentials: true,
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);
    socket.on("joinBoard", (boardId) => {
      socket.join(boardId);
      console.log(`User ${socket.id} joined board ${boardId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

export const getIO = () => io;