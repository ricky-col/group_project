import { io } from "socket.io-client";

// connect to your backend
const socket = io("http://localhost:3333", {
  transports: ["websocket"] // avoids xhr poll error
});

// connection success
socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

// connection error
socket.on("connect_error", (err) => {
  console.log("❌ Connection error:", err.message);
});

// ===== LISTEN EVENTS =====

// CARD EVENTS
socket.on("cardCreated", (data) => {
  console.log("🟢 cardCreated:", data);
});

socket.on("cardUpdated", (data) => {
  console.log("🟡 cardUpdated:", data);
});

socket.on("cardDeleted", (data) => {
  console.log("🔴 cardDeleted:", data);
});

socket.on("cardMoved", (data) => {
  console.log("🟣 cardMoved:", data);
});

socket.on("cardReordered", (data) => {
  console.log("🔵 cardReordered:", data);
});

// LIST EVENTS
socket.on("listCreated", (data) => {
  console.log("🟤 listCreated:", data);
});

socket.on("listUpdated", (data) => {
  console.log("🟠 listUpdated:", data);
});

socket.on("listDeleted", (data) => {
  console.log("⚫ listDeleted:", data);
});

// BOARD EVENTS (optional)
socket.on("boardCreated", (data) => {
  console.log("📦 boardCreated:", data);
});

socket.on("boardUpdated", (data) => {
  console.log("📦 boardUpdated:", data);
});

socket.on("boardDeleted", (data) => {
  console.log("📦 boardDeleted:", data);
});