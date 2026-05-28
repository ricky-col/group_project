import { io } from "socket.io-client";

const socket = io("https://group-project1-5ai9.onrender.com", {
  withCredentials: true,
  
});
socket.on("connect", () => {
  console.log(" Connected to socket:", socket.id);
});
export default socket;