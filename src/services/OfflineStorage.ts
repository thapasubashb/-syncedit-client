// src/services/OfflineStorage.ts
import Dexie, { Table } from 'dexie';

interface StoredOperation {
  id: string; // `${clientId}:${lamportTime}`
  documentId: string;
  clientId: number;
  lamportTime: number;
  operation: any; // the full operation object
  timestamp: number;
  synced: boolean;
}

class OfflineDatabase extends Dexie {
  operations!: Table<StoredOperation, string>;

  constructor() {
    super('CanvasSyncDB');
    this.version(1).stores({
      operations: 'id, documentId, synced, timestamp'
    });
  }
}

const db = new OfflineDatabase();

export const offlineStorage = {
  // Save an operation locally
  async saveOperation(operation: any, documentId: string): Promise<void> {
    const id = `${operation.clientId}:${operation.lamportTime}`;
    await db.operations.put({
      id,
      documentId,
      clientId: operation.clientId,
      lamportTime: operation.lamportTime,
      operation,
      timestamp: Date.now(),
      synced: false,
    });
    console.log(`💾 Saved offline operation: ${id}`);
  },

  // Get all unsynced operations for a document
  async getUnsyncedOperations(documentId: string): Promise<StoredOperation[]> {
    return db.operations
      .where('documentId')
      .equals(documentId)
      .and(item => !item.synced)
      .toArray();
  },

  // Mark operations as synced
  async markSynced(ids: string[]): Promise<void> {
    await db.operations.bulkUpdate(ids.map(id => ({ key: id, changes: { synced: true } })));
  },

  // Delete synced operations (after confirmation)
  async deleteSyncedOperations(documentId: string): Promise<void> {
    await db.operations
      .where('documentId')
      .equals(documentId)
      .and(item => item.synced)
      .delete();
  },

  // Clear all operations for a document (e.g., on full reconnection)
  async clearAllOperations(documentId: string): Promise<void> {
    await db.operations.where('documentId').equals(documentId).delete();
  },

  // Check if there are any unsynced operations for a document
  async hasUnsynced(documentId: string): Promise<boolean> {
    const count = await db.operations
      .where('documentId')
      .equals(documentId)
      .and(item => !item.synced)
      .count();
    return count > 0;
  },

  // Get all stored operations (for debugging)
  async getAllOperations(documentId?: string): Promise<StoredOperation[]> {
    if (documentId) {
      return db.operations.where('documentId').equals(documentId).toArray();
    }
    return db.operations.toArray();
  },
};