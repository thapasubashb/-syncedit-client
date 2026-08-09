// src/components/SimpleEditor.tsx
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useCRDT } from '../hooks/useCRDT';
import { ROOT_ID } from '../crdt/types';
import { useWebSocket } from '../context/WebSocketContext';
import { OperationQueue } from '../crdt/OperationQueue';
import { MessageType, BinaryInsert, BinaryDelete, BinaryCursor } from '../network';
import type { VertexId } from '../crdt/types';

interface EditorProps {
  clientId: number;
}

const SimpleEditor: React.FC<EditorProps> = ({ clientId }) => {
  const { rga, text, insertChar, deleteChar, getVertexAt, getHead, updateText } = useCRDT(clientId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInternalUpdate = useRef(false);
  const [remoteCursors, setRemoteCursors] = useState<Map<number, number>>(new Map());
  const [opQueue] = useState(() => new OperationQueue());

  const { clientId: wsClientId, sendBinary, onMessage, isConnected } = useWebSocket();
  const effectiveClientId = wsClientId || clientId;

  // Log when clientId updates
  useEffect(() => {
    console.log('🆔 WebSocket clientId updated:', wsClientId);
  }, [wsClientId]);

  // Send cursor position as binary
  const sendCursorPosition = useCallback(() => {
    if (textareaRef.current && isConnected && wsClientId !== null) {
      const pos = textareaRef.current.selectionStart;
      const cursorMsg: BinaryCursor = {
        type: MessageType.CURSOR,
        clientId: wsClientId,
        lamportTime: rga.nextLamport(),
        position: pos,
      };
      console.log('🟡 Sending cursor:', cursorMsg);
      sendBinary(cursorMsg);
    } else {
      console.warn('⛔ Cannot send cursor: wsClientId=', wsClientId, 'isConnected=', isConnected);
    }
  }, [sendBinary, isConnected, wsClientId, rga]);

  // Handle binary messages
  useEffect(() => {
    const handleBinaryMessage = (msg: any) => {
      console.log('📥 Binary handler received:', msg);

      // Skip our own messages
      if (msg.clientId === wsClientId) {
        console.log('⏭️ Skipping own message');
        return;
      }

      if (msg.type === MessageType.INSERT) {
        const insertMsg = msg as BinaryInsert;
        console.log('📥 Processing INSERT from client', insertMsg.clientId);

        const parentId = {
          clientId: insertMsg.parentClientId,
          lamportTime: insertMsg.parentLamport,
        };
        const vertexId = {
          clientId: insertMsg.vertexClientId,
          lamportTime: insertMsg.vertexLamport,
        };

        const queuedOp = {
          type: 'insert' as const,
          lamportTime: insertMsg.lamportTime,
          clientId: insertMsg.clientId,
          vertexId: vertexId,
          char: insertMsg.char,
          parentId: parentId,
        };
        opQueue.enqueue(queuedOp);
        const readyOps = opQueue.process();
        for (const op of readyOps) {
          if (op.type === 'insert' && op.vertexId && op.char && op.parentId) {
            rga.updateClock(op.lamportTime);
            rga.insertWithId(op.char, op.parentId, op.vertexId);
          }
        }
        if (readyOps.length > 0) {
          updateText();
          console.log(`📥 Applied ${readyOps.length} remote inserts`);
        }
      } else if (msg.type === MessageType.DELETE) {
        const deleteMsg = msg as BinaryDelete;
        console.log('📥 Processing DELETE from client', deleteMsg.clientId);

        const vertexId = {
          clientId: deleteMsg.vertexClientId,
          lamportTime: deleteMsg.vertexLamport,
        };

        const queuedOp = {
          type: 'delete' as const,
          lamportTime: deleteMsg.lamportTime,
          clientId: deleteMsg.clientId,
          vertexId: vertexId,
        };
        opQueue.enqueue(queuedOp);
        const readyOps = opQueue.process();
        for (const op of readyOps) {
          if (op.type === 'delete' && op.vertexId) {
            rga.updateClock(op.lamportTime);
            rga.delete(op.vertexId);
          }
        }
        if (readyOps.length > 0) {
          updateText();
          console.log(`📥 Applied ${readyOps.length} remote deletes`);
        }
      } else if (msg.type === MessageType.CURSOR) {
        const cursorMsg = msg as BinaryCursor;
        console.log('📥 Processing CURSOR from client', cursorMsg.clientId, 'position:', cursorMsg.position);
        setRemoteCursors(prev => {
          const newMap = new Map(prev);
          newMap.set(cursorMsg.clientId, cursorMsg.position);
          return newMap;
        });
      }
    };

    // Register handler for all binary messages
    onMessage('all', handleBinaryMessage);
    console.log('✅ Binary message handler registered');
  }, [onMessage, rga, updateText, wsClientId, opQueue]);

  // Send insert operation as binary
  const localInsertChar = useCallback((char: string, parentId: VertexId) => {
    const vertex = insertChar(char, parentId);
    if (wsClientId !== null) {
      const binaryMsg: BinaryInsert = {
        type: MessageType.INSERT,
        clientId: wsClientId,
        lamportTime: vertex.id.lamportTime,
        parentClientId: parentId.clientId,
        parentLamport: parentId.lamportTime,
        vertexClientId: vertex.id.clientId,
        vertexLamport: vertex.id.lamportTime,
        char: char,
      };
      console.log('🔵 Sending INSERT binary:', binaryMsg);
      sendBinary(binaryMsg);
    } else {
      console.warn('⛔ Cannot send INSERT: wsClientId is null');
    }
    return vertex;
  }, [insertChar, sendBinary, wsClientId]);

  // Send delete operation as binary
  const localDeleteChar = useCallback((vertexId: VertexId) => {
    deleteChar(vertexId);
    if (wsClientId !== null) {
      const binaryMsg: BinaryDelete = {
        type: MessageType.DELETE,
        clientId: wsClientId,
        lamportTime: rga.nextLamport(),
        vertexClientId: vertexId.clientId,
        vertexLamport: vertexId.lamportTime,
      };
      console.log('🔴 Sending DELETE binary:', binaryMsg);
      sendBinary(binaryMsg);
    } else {
      console.warn('⛔ Cannot send DELETE: wsClientId is null');
    }
  }, [deleteChar, sendBinary, wsClientId, rga]);

  useEffect(() => {
    if (textareaRef.current && !isInternalUpdate.current) {
      const cursorPos = textareaRef.current.selectionStart;
      textareaRef.current.value = text;
      textareaRef.current.selectionStart = Math.min(cursorPos, text.length);
      textareaRef.current.selectionEnd = Math.min(cursorPos, text.length);
    }
    isInternalUpdate.current = false;
  }, [text]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    isInternalUpdate.current = true;
    const newText = e.target.value;
    const oldText = text;
    const cursorPos = e.target.selectionStart;

    if (newText.length > oldText.length) {
      const pos = cursorPos - 1;
      const char = newText[pos];
      if (char) {
        const vertex = pos === 0 ? getHead() : getVertexAt(pos - 1);
        const parentId = vertex ? vertex.id : ROOT_ID;
        localInsertChar(char, parentId);
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = pos + 1;
            textareaRef.current.selectionEnd = pos + 1;
          }
        }, 0);
      }
    } else if (newText.length < oldText.length) {
      const pos = cursorPos;
      const vertex = getVertexAt(pos);
      if (vertex) {
        localDeleteChar(vertex.id);
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = pos;
            textareaRef.current.selectionEnd = pos;
          }
        }, 0);
      }
    }
  }, [text, localInsertChar, localDeleteChar, getVertexAt, getHead]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const pos = e.currentTarget.selectionStart;
      const vertex = pos === 0 ? getHead() : getVertexAt(pos - 1);
      const parentId = vertex ? vertex.id : ROOT_ID;
      localInsertChar('\n', parentId);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = pos + 1;
          textareaRef.current.selectionEnd = pos + 1;
        }
      }, 0);
    }
  }, [localInsertChar, getVertexAt, getHead]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">📄 Document</span>
          <span className="text-xs text-slate-500 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full">
            {text.length} characters
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full ${
            isConnected 
              ? 'text-green-600 bg-green-100/80' 
              : 'text-red-600 bg-red-100/80'
          } backdrop-blur-sm`}>
            {isConnected ? '● Live' : '● Offline'}
          </span>
          <span className="text-xs text-slate-500 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full">
            👥 {remoteCursors.size + 1} online
          </span>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        defaultValue={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onSelect={sendCursorPosition}
        onClick={sendCursorPosition}
        className="w-full min-h-[450px] p-5 font-mono text-base border-0 outline-none resize-none bg-white/60 backdrop-blur-sm rounded-xl text-gray-800 placeholder:text-gray-400 shadow-inner"
        placeholder="Start typing..."
        style={{ lineHeight: '1.8', resize: 'none' }}
      />

      {remoteCursors.size > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
          {Array.from(remoteCursors.entries()).map(([id, pos]) => (
            <span key={id} className="bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
              👤 User {id}: position {pos}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleEditor;