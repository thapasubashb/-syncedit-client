// src/network/binaryProtocol.ts

export enum MessageType {
  INSERT = 0,
  DELETE = 1,
  CURSOR = 2,
  HEARTBEAT = 3,
  SHAPE_INSERT = 4,
  SHAPE_UPDATE = 5,
  SHAPE_DELETE = 6,
}

export interface BaseBinaryMessage {
  type: MessageType;
  clientId: number;
  lamportTime: number;
}

export interface BinaryInsert extends BaseBinaryMessage {
  type: MessageType.INSERT;
  parentClientId: number;
  parentLamport: number;
  vertexClientId: number;
  vertexLamport: number;
  char: string;
}

export interface BinaryDelete extends BaseBinaryMessage {
  type: MessageType.DELETE;
  vertexClientId: number;
  vertexLamport: number;
}

export interface BinaryCursor extends BaseBinaryMessage {
  type: MessageType.CURSOR;
  position: number;
}

export interface BinaryHeartbeat extends BaseBinaryMessage {
  type: MessageType.HEARTBEAT;
}

export interface BinaryShapeInsert extends BaseBinaryMessage {
  type: MessageType.SHAPE_INSERT;
  shapeVertex: any;
}

export interface BinaryShapeUpdate extends BaseBinaryMessage {
  type: MessageType.SHAPE_UPDATE;
  vertexId: { clientId: number; lamportTime: number };
  shapeData: any;
}

export interface BinaryShapeDelete extends BaseBinaryMessage {
  type: MessageType.SHAPE_DELETE;
  vertexId: { clientId: number; lamportTime: number };
}

export type BinaryMessage = BinaryInsert | BinaryDelete | BinaryCursor | BinaryHeartbeat | BinaryShapeInsert | BinaryShapeUpdate | BinaryShapeDelete;