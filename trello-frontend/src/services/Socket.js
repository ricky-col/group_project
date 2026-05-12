import { io } from "socket.io-client";

const socket = io("http://localhost:3333", {
  withCredentials: true,
  
});
socket.on("connect", () => {
  console.log("✅ Connected to socket:", socket.id);
});
export default socket;