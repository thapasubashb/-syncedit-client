// src/crdt/HistoryManager.ts
import type { Vertex, VertexId } from './types';

export interface HistoryEntry {
  type: 'insert' | 'delete';
  vertex?: Vertex;     // for insert: the inserted vertex; for delete: the vertex before deletion
  vertexId?: VertexId; // only used internally for delete entry
}

export class HistoryManager {
  private undoStack: HistoryEntry[] = [];
  private redoStack: HistoryEntry[] = [];
  private isRecording: boolean = true;

  push(entry: HistoryEntry): void {
    if (!this.isRecording) return;
    this.undoStack.push(entry);
    this.redoStack = []; // clear redo on new operation
  }

  popUndo(): HistoryEntry | undefined {
    return this.undoStack.pop();
  }

  pushRedo(entry: HistoryEntry): void {
    this.redoStack.push(entry);
  }

  popRedo(): HistoryEntry | undefined {
    return this.redoStack.pop();
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  // Temporarily disable recording for a function
  withRecordingOff<T>(fn: () => T): T {
    this.isRecording = false;
    try {
      return fn();
    } finally {
      this.isRecording = true;
    }
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}