import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import http from 'http';
import { IncomingMessage } from 'http';

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SyncEdit server is running' });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

interface Client {
  ws: WebSocket;
  clientId: number;
  documentId: string | null;
}

let nextClientId = 1;
const clients: Map<WebSocket, Client> = new Map();
const rooms: Map<string, Set<WebSocket>> = new Map();

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  const clientId = nextClientId++;
  console.log(`🔵 Client ${clientId} connected`);

  // Store client
  clients.set(ws, { ws, clientId, documentId: null });

  // Send welcome message with client ID
  ws.send(JSON.stringify({
    type: 'welcome',
    clientId,
    message: 'Connected to SyncEdit server'
  }));

  ws.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      console.log(`📨 Client ${clientId}:`, message.type);

      switch (message.type) {
        case 'join':
          // Join a document room
          const documentId = message.documentId || 'default';
          const client = clients.get(ws);
          if (client) {
            client.documentId = documentId;
            
            if (!rooms.has(documentId)) {
              rooms.set(documentId, new Set());
            }
            rooms.get(documentId)!.add(ws);
            console.log(`📄 Client ${clientId} joined room: ${documentId}`);
          }
          break;

        case 'operation':
          // Broadcast operation to all clients in the same room
          const clientInfo = clients.get(ws);
          if (clientInfo && clientInfo.documentId) {
            const room = rooms.get(clientInfo.documentId);
            if (room) {
              const payload = JSON.stringify({
                type: 'operation',
                clientId: clientInfo.clientId,
                operation: message.operation
              });
              
              room.forEach((clientWs) => {
                if (clientWs !== ws && clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(payload);
                }
              });
            }
          }
          break;

        case 'cursor':
          // Broadcast cursor position
          const cursorClient = clients.get(ws);
          if (cursorClient && cursorClient.documentId) {
            const room = rooms.get(cursorClient.documentId);
            if (room) {
              const payload = JSON.stringify({
                type: 'cursor',
                clientId: cursorClient.clientId,
                position: message.position
              });
              
              room.forEach((clientWs) => {
                if (clientWs !== ws && clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(payload);
                }
              });
            }
          }
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    const client = clients.get(ws);
    if (client && client.documentId) {
      const room = rooms.get(client.documentId);
      if (room) {
        room.delete(ws);
        if (room.size === 0) {
          rooms.delete(client.documentId);
        }
      }
    }
    clients.delete(ws);
    console.log(`🔴 Client ${clientId} disconnected`);
  });
});

server.listen(port, () => {
  console.log(`🚀 SyncEdit server running on http://localhost:${port}`);
  console.log(`📡 WebSocket server running on ws://localhost:${port}`);
});