// src/network/binaryEncoder.ts
import { MessageType, BinaryMessage } from './binaryProtocol';

export function encodeBinaryMessage(msg: BinaryMessage): ArrayBuffer {
  let payload: Uint8Array;
  let payloadLength = 0;

  switch (msg.type) {
    case MessageType.INSERT: {
      // ... existing INSERT encoding
      const charBytes = new TextEncoder().encode(msg.char);
      const byteLength = charBytes.length > 0 ? charBytes.length : 1;
      const buf = new ArrayBuffer(4 + 4 + 4 + 4 + byteLength);
      const view = new DataView(buf);
      let offset = 0;
      view.setUint32(offset, msg.parentClientId); offset += 4;
      view.setUint32(offset, msg.parentLamport); offset += 4;
      view.setUint32(offset, msg.vertexClientId); offset += 4;
      view.setUint32(offset, msg.vertexLamport); offset += 4;
      for (let i = 0; i < byteLength; i++) {
        view.setUint8(offset + i, charBytes[i] || 0);
      }
      payload = new Uint8Array(buf);
      payloadLength = buf.byteLength;
      break;
    }
    case MessageType.DELETE: {
      // ... existing DELETE encoding
      const buf = new ArrayBuffer(4 + 4);
      const view = new DataView(buf);
      view.setUint32(0, msg.vertexClientId);
      view.setUint32(4, msg.vertexLamport);
      payload = new Uint8Array(buf);
      payloadLength = 8;
      break;
    }
    case MessageType.CURSOR: {
      const buf = new ArrayBuffer(4);
      const view = new DataView(buf);
      view.setUint32(0, msg.position);
      payload = new Uint8Array(buf);
      payloadLength = 4;
      break;
    }
    case MessageType.HEARTBEAT: {
      payload = new Uint8Array(0);
      payloadLength = 0;
      break;
    }
    case MessageType.SHAPE_INSERT: {
      // Encode shape vertex as JSON string
      const json = JSON.stringify(msg.shapeVertex);
      const jsonBytes = new TextEncoder().encode(json);
      const buf = new ArrayBuffer(4 + jsonBytes.length); // length prefix (4 bytes) + data
      const view = new DataView(buf);
      view.setUint32(0, jsonBytes.length);
      for (let i = 0; i < jsonBytes.length; i++) {
        view.setUint8(4 + i, jsonBytes[i]);
      }
      payload = new Uint8Array(buf);
      payloadLength = buf.byteLength;
      break;
    }
    case MessageType.SHAPE_UPDATE: {
      const data = { vertexId: msg.vertexId, shapeData: msg.shapeData };
      const json = JSON.stringify(data);
      const jsonBytes = new TextEncoder().encode(json);
      const buf = new ArrayBuffer(4 + jsonBytes.length);
      const view = new DataView(buf);
      view.setUint32(0, jsonBytes.length);
      for (let i = 0; i < jsonBytes.length; i++) {
        view.setUint8(4 + i, jsonBytes[i]);
      }
      payload = new Uint8Array(buf);
      payloadLength = buf.byteLength;
      break;
    }
    case MessageType.SHAPE_DELETE: {
      const json = JSON.stringify(msg.vertexId);
      const jsonBytes = new TextEncoder().encode(json);
      const buf = new ArrayBuffer(4 + jsonBytes.length);
      const view = new DataView(buf);
      view.setUint32(0, jsonBytes.length);
      for (let i = 0; i < jsonBytes.length; i++) {
        view.setUint8(4 + i, jsonBytes[i]);
      }
      payload = new Uint8Array(buf);
      payloadLength = buf.byteLength;
      break;
    }
    default:
      throw new Error(`Unknown message type: ${msg.type}`);
  }

  // Build full message: header + payload
  const headerSize = 1 + 4 + 4 + 2;
  const totalSize = headerSize + payloadLength;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  let offset = 0;

  view.setUint8(offset, msg.type); offset += 1;
  view.setUint32(offset, msg.clientId); offset += 4;
  view.setUint32(offset, msg.lamportTime); offset += 4;
  view.setUint16(offset, payloadLength); offset += 2;
  if (payloadLength > 0) {
    new Uint8Array(buffer, offset, payloadLength).set(payload);
  }

  return buffer;
}