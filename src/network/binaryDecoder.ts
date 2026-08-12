// src/network/binaryDecoder.ts
import { MessageType, BinaryMessage } from './binaryProtocol';

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
    case MessageType.SHAPE_INSERT: {
      const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
      const jsonLength = dv.getUint32(0);
      const jsonBytes = new Uint8Array(payload.buffer, payload.byteOffset + 4, jsonLength);
      const json = new TextDecoder().decode(jsonBytes);
      const shapeVertex = JSON.parse(json);
      return {
        type: MessageType.SHAPE_INSERT,
        clientId,
        lamportTime,
        shapeVertex,
      };
    }
    case MessageType.SHAPE_UPDATE: {
      const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
      const jsonLength = dv.getUint32(0);
      const jsonBytes = new Uint8Array(payload.buffer, payload.byteOffset + 4, jsonLength);
      const json = new TextDecoder().decode(jsonBytes);
      const { vertexId, shapeData } = JSON.parse(json);
      return {
        type: MessageType.SHAPE_UPDATE,
        clientId,
        lamportTime,
        vertexId,
        shapeData,
      };
    }
    case MessageType.SHAPE_DELETE: {
      const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
      const jsonLength = dv.getUint32(0);
      const jsonBytes = new Uint8Array(payload.buffer, payload.byteOffset + 4, jsonLength);
      const json = new TextDecoder().decode(jsonBytes);
      const vertexId = JSON.parse(json);
      return {
        type: MessageType.SHAPE_DELETE,
        clientId,
        lamportTime,
        vertexId,
      };
    }
    default:
      throw new Error(`Unknown message type: ${type}`);
  }
}