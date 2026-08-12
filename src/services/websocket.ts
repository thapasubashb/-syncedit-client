// src/services/websocket.ts
import { encodeBinaryMessage, decodeBinaryMessage } from '../network';
import { BinaryMessage, MessageType } from '../network';

type MessageHandler = (data: BinaryMessage) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private clientId: number | null = null;
  private documentId: string = 'default';
  private handlers: Map<number | 'all', MessageHandler[]> = new Map();
  private messageBuffer: BinaryMessage[] = [];
  private isConnected = false;

  connect(documentId: string = 'default'): Promise<number> {
    return new Promise((resolve, reject) => {
      this.documentId = documentId;
      const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
      this.ws = new WebSocket(WS_URL);
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => {
        console.log('🔗 WebSocket connected (binary)');
        this.isConnected = true;
        this.ws?.send(JSON.stringify({ type: 'join', documentId: this.documentId }));
        this.flushBuffer();
      };

      this.ws.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
          try {
            const msg = decodeBinaryMessage(event.data);
            console.log('📨 Received binary:', msg);
            if (this.handlers.size === 0) {
              console.log('📦 Buffering message (no handlers yet)');
              this.messageBuffer.push(msg);
            } else {
              this.dispatchMessage(msg);
            }
          } catch (e) {
            console.error('Binary decode error:', e);
          }
        } else {
          // Text message (welcome, snapshot, etc.)
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'welcome') {
              this.clientId = data.clientId;
              resolve(data.clientId);
            }
          } catch (e) {
            console.error('JSON parse error:', e);
          }
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.isConnected = false;
      };
    });
  }

  private dispatchMessage(msg: BinaryMessage): void {
    const typeHandlers = this.handlers.get(msg.type) || [];
    typeHandlers.forEach(h => h(msg));
    const allHandlers = this.handlers.get('all') || [];
    allHandlers.forEach(h => h(msg));
  }

  private flushBuffer(): void {
    if (this.messageBuffer.length > 0) {
      console.log(`📤 Flushing ${this.messageBuffer.length} buffered messages`);
      const buffer = [...this.messageBuffer];
      this.messageBuffer = [];
      buffer.forEach(msg => this.dispatchMessage(msg));
    }
  }

  sendBinary(msg: BinaryMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const buffer = encodeBinaryMessage(msg);
      this.ws.send(buffer);
    } else {
      console.warn('WebSocket not open, binary message not sent');
    }
  }

  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  on(type: MessageType | 'all', handler: MessageHandler): void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push(handler);
    if (this.isConnected && this.messageBuffer.length > 0) {
      this.flushBuffer();
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