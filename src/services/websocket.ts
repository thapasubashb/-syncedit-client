// src/services/websocket.ts

type MessageHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private clientId: number | null = null;
  private documentId: string = 'default';
  private handlers: Map<string, MessageHandler[]> = new Map();

  connect(documentId: string = 'default'): Promise<number> {
    return new Promise((resolve, reject) => {
      this.documentId = documentId;
      this.ws = new WebSocket('ws://localhost:8080');

      this.ws.onopen = () => {
        console.log('🔗 WebSocket connected');
        this.send({
          type: 'join',
          documentId: this.documentId
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📨 Received:', message);

          if (message.type === 'welcome') {
            this.clientId = message.clientId;
            resolve(message.clientId);
          }

          const handlers = this.handlers.get(message.type) || [];
          handlers.forEach(handler => handler(message));
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
      };
    });
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not open, message not sent');
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push(handler);
  }

  off(type: string, handler: MessageHandler) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  getClientId(): number | null {
    return this.clientId;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();