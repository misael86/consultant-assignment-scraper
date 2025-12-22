export class SocketService {
  private static instance: SocketService;
  private socket: WebSocket | null = null;
  private listeners: ((data: any) => void)[] = [];

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(): WebSocket {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      this.socket = new WebSocket("ws://localhost:8080");
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.listeners.forEach((listener) => listener(data));
        } catch (error) {
          console.error("Failed to parse WebSocket message", error);
        }
      };
      this.socket.onclose = () => {
        console.log("WebSocket disconnected");
      };
    }
    return this.socket;
  }

  public subscribe(callback: (data: any) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  public send(data: any): void {
    const ws = this.connect();
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    } else {
      ws.addEventListener("open", () => {
        ws.send(JSON.stringify(data));
      }, { once: true });
    }
  }
}
