import WebSocket, { WebSocketServer } from "ws";

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

wss.on("listening", () => {
  console.log(`WebSocket server is listening on port ${PORT}`);
})
