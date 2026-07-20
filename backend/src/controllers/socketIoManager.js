import { randomUUID } from "node:crypto";
import { Server } from "socket.io";
import { corsOrigin } from "../config/cors.js";

const rooms = new Map();
const socketRooms = new Map();
const roomMessages = new Map();

export const connetTosocket = (server) => {
  const io = new Server(server, {
    cors: { origin: corsOrigin, methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    socket.on("join-call", (rawRoomId) => {
      const roomId = String(rawRoomId || "home").trim();
      const members = rooms.get(roomId) || new Set();
      members.add(socket.id);
      rooms.set(roomId, members);
      socketRooms.set(socket.id, roomId);
      socket.join(roomId);

      io.to(roomId).emit("user-joined", socket.id, [...members]);
      for (const message of roomMessages.get(roomId) || []) {
        socket.emit("chat-message", message.text, message.sender, message.senderId, message.id);
      }
    });

    socket.on("signal", (toId, message) => {
      if (socketRooms.get(toId) === socketRooms.get(socket.id)) {
        io.to(toId).emit("signal", socket.id, message);
      }
    });

    socket.on("chat-message", (payload, legacySender) => {
      const roomId = socketRooms.get(socket.id);
      const text = typeof payload === "string" ? payload : payload?.text;
      const sender = typeof payload === "string" ? legacySender : payload?.sender;
      if (!roomId || !String(text || "").trim()) return;

      const message = {
        id: randomUUID(),
        text: String(text).trim().slice(0, 2000),
        sender: String(sender || "Guest").trim().slice(0, 80),
        senderId: socket.id,
      };
      const history = roomMessages.get(roomId) || [];
      roomMessages.set(roomId, [...history.slice(-99), message]);
      io.to(roomId).emit("chat-message", message.text, message.sender, message.senderId, message.id);
    });

    socket.on("disconnect", () => {
      const roomId = socketRooms.get(socket.id);
      if (!roomId) return;
      const members = rooms.get(roomId);
      members?.delete(socket.id);
      socketRooms.delete(socket.id);
      socket.to(roomId).emit("user-left", socket.id);
      if (!members?.size) {
        rooms.delete(roomId);
        roomMessages.delete(roomId);
      }
    });
  });

  return io;
};
