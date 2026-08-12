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

  // Local insertion – generates a new Lamport timestamp
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

  // Remote insertion – uses an existing ID (from another client)
  public insertShapeWithId(shapeData: ShapeData, parentId: ShapeVertexId, id: ShapeVertexId): ShapeVertex {
    // Check if a vertex with this ID already exists (idempotent)
    const existing = this.vertices.get(this.keyOf(id));
    if (existing) {
      return existing;
    }
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
        // Last‑write‑wins: newer Lamport timestamp overrides shape data
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