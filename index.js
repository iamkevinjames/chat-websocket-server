import WebSocket, { WebSocketServer } from "ws";

const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ port: PORT });

const clients = new Map(); // userId -> socket

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (data) => {
    const message = JSON.parse(data);
    const { type, userId, receiverId } = message;

    // Register user
    if (type === "register") {
      clients.set(userId, ws);
      console.log(`User registered: ${userId}`);
      return;
    }

    // Send message to receiver if online
    const receiverSocket = clients.get(receiverId);
    if (receiverSocket) {
      receiverSocket.send(JSON.stringify(message));
    }
  });

  ws.on("close", () => {
    for (const [key, value] of clients.entries()) {
      if (value === ws) {
        clients.delete(key);
        break;
      }
    }
    console.log("Client disconnected");
  });
});

console.log(`WebSocket server running on port ${PORT}`);
