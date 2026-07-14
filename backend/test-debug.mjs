import WebSocket from "ws";

const code = `
total = 0
for i in range(3):
  total += i
print(total)
`;

const desktop = new WebSocket("ws://localhost:3001");
const frontend = new WebSocket("ws://localhost:3001");

desktop.on("open", () => {
  console.log("[Desktop] connected");
  desktop.send(JSON.stringify({ type: "register", role: "desktop" }));
})

desktop.on("message", (raw) => {
  console.log("[desktop] received: ", raw.toString());
})

frontend.on("open", () => {
  console.log("[frontend] connected");
  setTimeout(() => {
    console.log("[frontend] sending debug request");
    frontend.send(JSON.stringify({ type: "debug", code }));
  }, 500);
});

frontend.on("message", (raw) => {
  console.log("[frontend] received:", raw.toString());
});

setTimeout(() => {
  frontend.close();
  desktop.close();
  process.exit(0);
}, 5000);
