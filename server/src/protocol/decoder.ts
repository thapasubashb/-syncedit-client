// server/src/protocol/decoder.ts

export enum MessageType {
  INSERT = 0,
  DELETE = 1,
  CURSOR = 2,
  HEARTBEAT = 3,
}

export interface BinaryInsert {
  type: MessageType.INSERT;
  clientId: number;
  lamportTime: number;
  parentClientId: number;
  parentLamport: number;
  vertexClientId: number;
  vertexLamport: number;
  char: string;
}

export interface BinaryDelete {
  type: MessageType.DELETE;
  clientId: number;
  lamportTime: number;
  vertexClientId: number;
  vertexLamport: number;
}

export interface BinaryCursor {
  type: MessageType.CURSOR;
  clientId: number;
  lamportTime: number;
  position: number;
}

export interface BinaryHeartbeat {
  type: MessageType.HEARTBEAT;
  clientId: number;
  lamportTime: number;
}

export type BinaryMessage = BinaryInsert | BinaryDelete | BinaryCursor | BinaryHeartbeat;

export function decodeBinaryMessage(buffer: ArrayBuffer): BinaryMessage {
  const view = new DataView(buffer);
  let offset = 0;

  const type = view.getUint8(offset); offset += 1;
  const clientId = view.getUint32(offset); offset += 4;
  const lamportTime = view.getUint32(offset); offset += 4;
  const payloadLength = view.getUint16(offset); offset += 2;

  const payload = new Uint8Array(buffer, offset, payloadLength);

  switch (type) {
    case MessageType.INSERT: {
      const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
      let p = 0;
      const parentClientId = dv.getUint32(p); p += 4;
      const parentLamport = dv.getUint32(p); p += 4;
      const vertexClientId = dv.getUint32(p); p += 4;
      const vertexLamport = dv.getUint32(p); p += 4;
      const charBytes = new Uint8Array(payload.buffer, payload.byteOffset + p, payload.byteLength - p);
      const char = new TextDecoder().decode(charBytes);
      return {
        type: MessageType.INSERT,
        clientId,
        lamportTime,
        parentClientId,
        parentLamport,
        vertexClientId,
        vertexLamport,
        char,
      };
    }
    case MessageType.DELETE: {
      const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
      const vertexClientId = dv.getUint32(0);
      const vertexLamport = dv.getUint32(4);
      return {
        type: MessageType.DELETE,
        clientId,
        lamportTime,
        vertexClientId,
        vertexLamport,
      };
    }
    case MessageType.CURSOR: {
      const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
      const position = dv.getUint32(0);
      return {
        type: MessageType.CURSOR,
        clientId,
        lamportTime,
        position,
      };
    }
    case MessageType.HEARTBEAT:
      return {
        type: MessageType.HEARTBEAT,
        clientId,
        lamportTime,
      };
    default:
      throw new Error(`Unknown message type: ${type}`);
  }
}