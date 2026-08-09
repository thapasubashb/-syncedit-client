// server/src/index.ts
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import http from 'http';
import { IncomingMessage } from 'http';
import { decodeBinaryMessage, MessageType } from './protocol/decoder';

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Canvas_Sync server running' });
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

  clients.set(ws, { ws, clientId, documentId: null });

  ws.send(JSON.stringify({
    type: 'welcome',
    clientId,
    message: 'Connected to Canvas_Sync server'
  }));

  ws.on('message', (data: Buffer) => {
    try {
      // Check if binary: first byte not a valid JSON start char ( { )
      const isBinary = data.length > 0 && data[0] !== 123; // 123 is '{'
      
      if (isBinary) {
        // Decode binary
        const msg = decodeBinaryMessage(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
        console.log(`📨 Binary from ${msg.clientId}:`, msg);

        const client = clients.get(ws);
        if (!client || !client.documentId) {
          console.warn('Client not in a room, dropping binary message');
          return;
        }
        const room = rooms.get(client.documentId);
        if (!room) {
          console.warn('No room for document:', client.documentId);
          return;
        }

        // Broadcast to all others in the room
        let broadcastCount = 0;
        room.forEach((clientWs) => {
          if (clientWs !== ws && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(data);
            broadcastCount++;
          }
        });
        console.log(`📤 Broadcast binary to ${broadcastCount} clients in room ${client.documentId}`);
      } else {
        // JSON message
        const message = JSON.parse(data.toString());
        console.log(`📨 JSON from ${clientId}:`, message.type);

        switch (message.type) {
          case 'join': {
            const documentId = message.documentId || 'default';
            const client = clients.get(ws);
            if (client) {
              client.documentId = documentId;
              if (!rooms.has(documentId)) {
                rooms.set(documentId, new Set());
              }
              rooms.get(documentId)!.add(ws);
              console.log(`📄 Client ${clientId} joined room: ${documentId}`);
              ws.send(JSON.stringify({ type: 'joined', documentId, clientId }));
            }
            break;
          }
          case 'operation': {
            // Fallback JSON operation forwarding
            const client = clients.get(ws);
            if (client && client.documentId) {
              const room = rooms.get(client.documentId);
              if (room) {
                const payload = JSON.stringify({
                  type: 'operation',
                  clientId: client.clientId,
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
          }
          case 'cursor': {
            const client = clients.get(ws);
            if (client && client.documentId) {
              const room = rooms.get(client.documentId);
              if (room) {
                const payload = JSON.stringify({
                  type: 'cursor',
                  clientId: client.clientId,
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
          default:
            console.log('Unknown JSON message type:', message.type);
        }
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
  console.log(`🚀 Canvas_Sync server running on http://localhost:${port}`);
  console.log(`📡 WebSocket server running on ws://localhost:${port}`);
});