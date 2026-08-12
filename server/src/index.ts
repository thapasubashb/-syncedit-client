// server/src/index.ts
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import http from 'http';
import { IncomingMessage } from 'http';
import { db } from './database';
import { decodeBinaryMessage, MessageType } from './protocol/decoder';

const app = express();
const port = process.env.PORT || 8080;

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

// In‑memory cache for text vertices
const documentCache: Map<string, any> = new Map();

async function getDocumentContent(documentId: string): Promise<any> {
  if (documentCache.has(documentId)) {
    return documentCache.get(documentId);
  }
  const doc = await db.getDocument(documentId);
  const content = doc.content ? JSON.parse(doc.content) : {};
  documentCache.set(documentId, content);
  return content;
}

async function updateDocumentContent(documentId: string, content: any): Promise<void> {
  documentCache.set(documentId, content);
  await db.updateDocumentContent(documentId, content);
}

wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
  const clientId = nextClientId++;
  console.log(`🔵 Client ${clientId} connected`);

  clients.set(ws, { ws, clientId, documentId: null });

  ws.send(JSON.stringify({
    type: 'welcome',
    clientId,
    message: 'Connected to Canvas_Sync server'
  }));

  ws.on('message', async (data: Buffer) => {
    try {
      const firstByte = data[0];
      const isBinaryMessage = firstByte !== undefined && firstByte >= 0 && firstByte <= 6;

      if (isBinaryMessage) {
        // --- Binary message ---
        const msg = decodeBinaryMessage(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
        console.log(`📨 Binary from ${msg.clientId}: type=${msg.type}`);

        const client = clients.get(ws);
        if (!client || !client.documentId) return;
        const docId = client.documentId;

        // For text operations (type 0,1), update server's in‑memory content
        if (msg.type === MessageType.INSERT) {
          const vertexId = { clientId: msg.vertexClientId, lamportTime: msg.vertexLamport };
          const parentId = { clientId: msg.parentClientId, lamportTime: msg.parentLamport };
          const key = `${vertexId.clientId}:${vertexId.lamportTime}`;
          let content = await getDocumentContent(docId);
          content[key] = {
            id: vertexId,
            char: msg.char,
            isTombstone: false,
            parentId: parentId
          };
          await updateDocumentContent(docId, content);
        } else if (msg.type === MessageType.DELETE) {
          const vertexId = { clientId: msg.vertexClientId, lamportTime: msg.vertexLamport };
          const key = `${vertexId.clientId}:${vertexId.lamportTime}`;
          let content = await getDocumentContent(docId);
          if (content[key]) {
            content[key].isTombstone = true;
            await updateDocumentContent(docId, content);
          }
        }

        // --- Broadcast to room (excluding sender) ---
        const room = rooms.get(docId);
        if (room) {
          console.log(`📤 Broadcasting binary to ${room.size} clients in room ${docId}`);
          room.forEach((clientWs) => {
            if (clientWs !== ws && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(data);
            }
          });
        } else {
          console.warn(`⚠️ No room found for ${docId}`);
        }

        // Save operation for history (only for text ops)
        if (msg.type === MessageType.INSERT || msg.type === MessageType.DELETE) {
          await db.saveOperation({
            documentId: docId,
            clientId: msg.clientId,
            type: msg.type === MessageType.INSERT ? 'insert' : 'delete',
            vertexId: msg.vertexClientId ? { clientId: msg.vertexClientId, lamportTime: msg.vertexLamport } : undefined,
            char: msg.type === MessageType.INSERT ? msg.char : undefined,
            parentId: msg.type === MessageType.INSERT ? { clientId: msg.parentClientId, lamportTime: msg.parentLamport } : undefined,
            lamportTime: msg.lamportTime,
          });
        }

      } else {
        // --- JSON message ---
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

              // Load document content and send snapshot
              const content = await getDocumentContent(documentId);
              ws.send(JSON.stringify({
                type: 'snapshot',
                content: content,
                documentId
              }));

              ws.send(JSON.stringify({
                type: 'joined',
                documentId,
                clientId
              }));
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
          documentCache.delete(client.documentId);
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