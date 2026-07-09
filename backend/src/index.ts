import WebSocket, { WebSocketServer } from "ws";
import { getPythonPath } from "./utils/pathResolver.js";

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

wss.on("listening", () => {
  console.log(`[WebSocket]: server is listening on port ${PORT}`);
  getPythonPath().then((path) => console.log(path));
})
