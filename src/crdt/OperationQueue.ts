// src/crdt/OperationQueue.ts
import { VertexId } from './types';

export interface QueuedOperation {
  type: 'insert' | 'delete';
  lamportTime: number;
  clientId: number;
  vertexId?: VertexId;
  char?: string;
  parentId?: VertexId;
}

export class OperationQueue {
  private queue: QueuedOperation[] = [];
  private lastAppliedLamport: number = 0;
  private lastAppliedClientId: number = 0;

  // Add an operation to the queue and sort by (lamportTime, clientId)
  enqueue(op: QueuedOperation): void {
    this.queue.push(op);
    this.queue.sort((a, b) => {
      if (a.lamportTime !== b.lamportTime) {
        return a.lamportTime - b.lamportTime;
      }
      return a.clientId - b.clientId;
    });
  }

  // Process all operations that are ready (in order) and return them
  process(): QueuedOperation[] {
    const applied: QueuedOperation[] = [];
    let i = 0;
    while (i < this.queue.length) {
      const op = this.queue[i];
      // Skip if timestamp is less than or equal to last applied (duplicate or stale)
      if (op.lamportTime < this.lastAppliedLamport ||
          (op.lamportTime === this.lastAppliedLamport && op.clientId <= this.lastAppliedClientId)) {
        this.queue.splice(i, 1);
        continue;
      }
      // Since WebSocket preserves order, all operations are ready.
      // In a more complex scenario, we'd check for missing dependencies.
      applied.push(op);
      this.lastAppliedLamport = op.lamportTime;
      this.lastAppliedClientId = op.clientId;
      i++;
    }
    // Remove applied operations
    this.queue = this.queue.filter(op => !applied.includes(op));
    return applied;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  // Reset the queue (useful on reconnection)
  reset(): void {
    this.queue = [];
    this.lastAppliedLamport = 0;
    this.lastAppliedClientId = 0;
  }
}