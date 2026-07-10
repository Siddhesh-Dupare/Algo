import WebSocket from "ws";

const code = `
def add(a, b):
    return a + b

print(add(2, 3))
`;

const ws = new WebSocket("ws://localhost:3001");
ws.on("open", () => {
  console.log("[trigger] connected, sending debug request");
  ws.send(JSON.stringify({ type: "debug", code }));
});
ws.on("message", (raw) => {
  console.log("[trigger] received:", raw.toString());
});
setTimeout(() => process.exit(0), 4000);
