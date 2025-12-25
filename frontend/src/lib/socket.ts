import { ScrapeAssignmentsEventRequest, ScrapeAssignmentsEventResponse } from "@shared/server-event";

export class SocketService {
  private static instance: SocketService;
  private listeners: ((data: ScrapeAssignmentsEventResponse) => void)[] = [];
  private socket: undefined | WebSocket = undefined;

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(): WebSocket {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      this.socket = new WebSocket("ws://localhost:8080");
      this.socket.addEventListener("message", (event: MessageEvent<string>) => {
        try {
          const data = JSON.parse(event.data) as ScrapeAssignmentsEventResponse;
          for (const listener of this.listeners) listener(data);
        } catch (error) {
          console.error("Failed to parse WebSocket message", error);
        }
      });
      this.socket.addEventListener("close", () => {
        console.log("WebSocket disconnected");
      });
    }
    return this.socket;
  }

  public send(data: ScrapeAssignmentsEventRequest): void {
    const ws = this.connect();
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    } else {
      ws.addEventListener(
        "open",
        () => {
          ws.send(JSON.stringify(data));
        },
        { once: true }
      );
    }
  }

  public subscribe(callback: (data: ScrapeAssignmentsEventResponse) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }
}
