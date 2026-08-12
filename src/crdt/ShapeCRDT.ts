// src/crdt/ShapeCRDT.ts
import { ShapeVertex, ShapeVertexId, ShapeData } from './shapeTypes';

export class ShapeCRDT {
  private vertices: Map<string, ShapeVertex> = new Map();
  private clientId: number;
  private lamportClock: number;

  constructor(clientId: number) {
    this.clientId = clientId;
    this.lamportClock = 0;
  }

  private keyOf(id: ShapeVertexId): string {
    return `${id.clientId}:${id.lamportTime}`;
  }

  public nextLamport(): number {
    return ++this.lamportClock;
  }

  public insertShape(shapeData: ShapeData, parentId: ShapeVertexId): ShapeVertex {
    const id: ShapeVertexId = {
      clientId: this.clientId,
      lamportTime: this.nextLamport()
    };
    const vertex: ShapeVertex = {
      id,
      shapeData,
      isTombstone: false,
      parentId,
      layer: 0,
    };
    this.vertices.set(this.keyOf(id), vertex);
    return vertex;
  }

  public updateShape(shapeId: ShapeVertexId, updates: Partial<ShapeData>): void {
    const vertex = this.vertices.get(this.keyOf(shapeId));
    if (vertex && !vertex.isTombstone) {
      vertex.shapeData = { ...vertex.shapeData, ...updates };
    }
  }

  public deleteShape(shapeId: ShapeVertexId): void {
    const vertex = this.vertices.get(this.keyOf(shapeId));
    if (vertex) {
      vertex.isTombstone = true;
    }
  }

  public getOrderedShapes(): ShapeVertex[] {
    // Simple order: just return all non-tombstone vertices
    // For more complex layer ordering, we'd sort by layer
    const result: ShapeVertex[] = [];
    for (const [_, vertex] of this.vertices) {
      if (!vertex.isTombstone) {
        result.push(vertex);
      }
    }
    return result.sort((a, b) => a.layer - b.layer);
  }

  public merge(other: ShapeCRDT): void {
    for (const [key, vertex] of other.vertices) {
      if (!this.vertices.has(key)) {
        this.vertices.set(key, { ...vertex });
      } else {
        const local = this.vertices.get(key)!;
        local.isTombstone = local.isTombstone || vertex.isTombstone;
        // For shape properties, we could use LWW (Last-Write-Wins) with Lamport
        // Simple approach: if remote has newer lamport, override
        if (vertex.id.lamportTime > local.id.lamportTime) {
          local.shapeData = { ...vertex.shapeData };
        }
      }
    }
  }

  public toJSON(): any {
    return Object.fromEntries(this.vertices);
  }

  public fromJSON(data: any): void {
    this.vertices = new Map();
    for (const [key, value] of Object.entries(data)) {
      this.vertices.set(key, value as ShapeVertex);
    }
  }
}