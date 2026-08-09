// src/network/binaryProtocol.ts

export enum MessageType {
  INSERT = 0,
  DELETE = 1,
  CURSOR = 2,
  HEARTBEAT = 3,
}

// Base interface with common fields
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
  char: string; // single character
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

export type BinaryMessage = BinaryInsert | BinaryDelete | BinaryCursor | BinaryHeartbeat;