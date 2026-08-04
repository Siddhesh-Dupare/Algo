
class WebSocketService {
  private socket?: WebSocket;

  connect() {
    console.log("connecting called");
    if (this.socket) return;

    this.socket = new WebSocket("ws://localhost:8080/ws");
    this.socket.onopen = () => {
      console.log("✅ Connected");
    };

    this.socket.onerror = (err) => {
      console.error(err);
    };

    this.socket.onclose = () => {
      console.log("❌ Disconnected");
      this.socket = undefined;
    };
  }

  send(data: unknown) {
    if (!this.socket) {
      console.error("WebSocket is not connected.");
      return;
    }

    if (this.socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not open.");
      return;
    }

    this.socket?.send(JSON.stringify(data));
  }

  onMessage(callback: (msg: unknown) => void) {
    if (!this.socket) return;

    this.socket.onmessage = (event) => {
        callback(JSON.parse(event.data));
    };
  }

  disconnect() {
    if (!this.socket) return;

    this.socket.close();
  }
}

export const webSocket = new WebSocketService();
