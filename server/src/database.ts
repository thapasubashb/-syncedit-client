// server/src/database.ts
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Create the adapter
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

// Pass the adapter to PrismaClient
const prisma = new PrismaClient({ adapter });

export const db = {
  async getDocument(documentId: string): Promise<{ id: string; content: string }> {
    let doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc) {
      doc = await prisma.document.create({
        data: { id: documentId, content: JSON.stringify({}), name: 'Untitled' }
      });
    }
    return doc;
  },

  async updateDocumentContent(documentId: string, content: any): Promise<void> {
    await prisma.document.update({
      where: { id: documentId },
      data: { content: JSON.stringify(content) }
    });
  },

  async saveOperation(data: {
    documentId: string;
    clientId: number;
    type: string;
    vertexId?: any;
    char?: string;
    parentId?: any;
    lamportTime: number;
  }): Promise<void> {
    await prisma.operation.create({
      data: {
        documentId: data.documentId,
        clientId: data.clientId,
        type: data.type,
        vertexId: data.vertexId ? JSON.stringify(data.vertexId) : null,
        char: data.char || null,
        parentId: data.parentId ? JSON.stringify(data.parentId) : null,
        lamportTime: data.lamportTime,
      }
    });
  },

  async getOperations(documentId: string): Promise<any[]> {
    const ops = await prisma.operation.findMany({
      where: { documentId },
      orderBy: { lamportTime: 'asc' }
    });
    return ops.map(op => ({
      ...op,
      vertexId: op.vertexId ? JSON.parse(op.vertexId) : null,
      parentId: op.parentId ? JSON.parse(op.parentId) : null,
    }));
  }
};