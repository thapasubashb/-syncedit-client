// src/crdt/types.ts
export interface VertexId {
  clientId: number;
  lamportTime: number;
}

export interface Vertex {
  id: VertexId;
  char: string;
  isTombstone: boolean;
  parentId: VertexId;
}

export function compareIds(a: VertexId, b: VertexId): number {
  if (a.lamportTime !== b.lamportTime) {
    return a.lamportTime - b.lamportTime;
  }
  return a.clientId - b.clientId;
}

export function keyOf(id: VertexId): string {
  return `${id.clientId}:${id.lamportTime}`;
}

export const ROOT_ID: VertexId = { clientId: 0, lamportTime: 0 };