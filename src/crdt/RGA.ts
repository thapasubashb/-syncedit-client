// src/crdt/RGA.ts
import { compareIds, keyOf, ROOT_ID } from './types';
import type { Vertex, VertexId } from './types';

export class RGA {
  private vertices: Map<string, Vertex> = new Map();
  private headId: VertexId = ROOT_ID;
  private clientId: number;
  private lamportClock: number;

  constructor(clientId: number) {
    this.clientId = clientId;
    this.lamportClock = 0;
    
    // Create a dummy root vertex
    const root: Vertex = {
      id: this.headId,
      char: '',
      isTombstone: false,
      parentId: ROOT_ID
    };
    this.vertices.set(keyOf(this.headId), root);
  }

  public nextLamport(): number {
    return ++this.lamportClock;
  }

  public insert(char: string, parentId: VertexId): Vertex {
    const id: VertexId = {
      clientId: this.clientId,
      lamportTime: this.nextLamport()
    };
    const vertex: Vertex = {
      id,
      char,
      isTombstone: false,
      parentId
    };
    this.vertices.set(keyOf(id), vertex);
    return vertex;
  }

  public delete(vertexId: VertexId): void {
    const vertex = this.vertices.get(keyOf(vertexId));
    if (vertex) {
      vertex.isTombstone = true;
    }
  }

  public toText(): string {
    return this.getOrderedVertices()
      .filter(v => !v.isTombstone)
      .map(v => v.char)
      .join('');
  }

  public getOrderedVertices(): Vertex[] {
    const result: Vertex[] = [];
    const childrenMap = new Map<string, Vertex[]>();
    
    for (const [_, vertex] of this.vertices) {
      const parentKey = keyOf(vertex.parentId);
      if (!childrenMap.has(parentKey)) {
        childrenMap.set(parentKey, []);
      }
      childrenMap.get(parentKey)!.push(vertex);
    }

    for (const [_, children] of childrenMap) {
      children.sort((a, b) => compareIds(a.id, b.id));
    }

    const traverse = (parentId: VertexId) => {
      const parentKey = keyOf(parentId);
      const parent = this.vertices.get(parentKey);
      if (parent) result.push(parent);
      const children = childrenMap.get(parentKey) || [];
      for (const child of children) {
        traverse(child.id);
      }
    };

    traverse(this.headId);
    return result;
  }

  public getVertexAt(index: number): Vertex | undefined {
    const ordered = this.getOrderedVertices();
    let visibleIndex = 0;
    for (const v of ordered) {
      if (!v.isTombstone) {
        if (visibleIndex === index) return v;
        visibleIndex++;
      }
    }
    return undefined;
  }

  public getHead(): Vertex {
    return this.vertices.get(keyOf(this.headId))!;
  }

  public merge(other: RGA): void {
    for (const [key, vertex] of other.vertices) {
      if (!this.vertices.has(key)) {
        this.vertices.set(key, { ...vertex });
      } else {
        const local = this.vertices.get(key)!;
        local.isTombstone = local.isTombstone || vertex.isTombstone;
      }
    }
  }
}