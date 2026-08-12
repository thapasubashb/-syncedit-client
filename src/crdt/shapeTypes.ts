// src/crdt/shapeTypes.ts

export interface ShapeVertexId {
  clientId: number;
  lamportTime: number;
}

export type ShapeType = 'rectangle' | 'circle' | 'line' | 'pen' | 'textbox';

export interface ShapeData {
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  fill: string;
  strokeWidth: number;
  rotation: number;
  points?: { x: number; y: number }[];
  text?: string;
}

export interface ShapeVertex {
  id: ShapeVertexId;
  shapeData: ShapeData;
  isTombstone: boolean;
  parentId: ShapeVertexId;
  layer: number; // z-index
}