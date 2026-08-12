// src/components/SimpleEditor.tsx
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useCRDT } from '../hooks/useCRDT';
import { ROOT_ID } from '../crdt/types';
import { useWebSocket } from '../context/WebSocketContext';
import { OperationQueue } from '../crdt/OperationQueue';
import { HistoryManager } from '../crdt/HistoryManager';
import { MessageType, BinaryInsert, BinaryDelete, BinaryCursor } from '../network';
import { offlineStorage } from '../services/OfflineStorage';
import type { VertexId, Vertex } from '../crdt/types';


interface EditorProps {
  clientId: number;
}

const SimpleEditor: React.FC<EditorProps> = ({ clientId }) => {
  const { rga, text, insertChar, deleteChar, getVertexAt, getHead, updateText } = useCRDT(clientId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInternalUpdate = useRef(false);
  const [remoteCursors, setRemoteCursors] = useState<Map<number, number>>(new Map());
  const [opQueue] = useState(() => new OperationQueue());
  const [history] = useState(() => new HistoryManager());
  const [isInitialized, setIsInitialized] = useState(false);

  const { clientId: wsClientId, sendBinary, onMessage, isConnected } = useWebSocket();
  const effectiveClientId = wsClientId || clientId;

  // --- Initialize offline storage ---
  useEffect(() => {
    const init = async () => {
      await offlineStorage.init();
      setIsInitialized(true);
    };
    init();
  }, []);

  // --- Apply binary message locally ---
  const applyBinaryMessage = useCallback((msg: any) => {
    if (msg.type === MessageType.INSERT) {
      const insertMsg = msg as BinaryInsert;
      const parentId = {
        clientId: insertMsg.parentClientId,
        lamportTime: insertMsg.parentLamport,
      };
      const vertexId = {
        clientId: insertMsg.vertexClientId,
        lamportTime: insertMsg.vertexLamport,
      };
      rga.updateClock(insertMsg.lamportTime);
      rga.insertWithId(insertMsg.char, parentId, vertexId);
      updateText();
    } else if (msg.type === MessageType.DELETE) {
      const deleteMsg = msg as BinaryDelete;
      const vertexId = {
        clientId: deleteMsg.vertexClientId,
        lamportTime: deleteMsg.vertexLamport,
      };
      rga.updateClock(deleteMsg.lamportTime);
      rga.delete(vertexId);
      updateText();
    } else if (msg.type === MessageType.CURSOR) {
      const cursorMsg = msg as BinaryCursor;
      setRemoteCursors(prev => {
        const newMap = new Map(prev);
        newMap.set(cursorMsg.clientId, cursorMsg.position);
        return newMap;
      });
    }
  }, [rga, updateText]);

  // --- Remote binary message handler ---
  useEffect(() => {
    const handleBinaryMessage = (msg: any) => {
      if (msg.clientId === wsClientId) return;
      if (msg.type === MessageType.INSERT || msg.type === MessageType.DELETE) {
        let queuedOp: any;
        if (msg.type === MessageType.INSERT) {
          const insertMsg = msg as BinaryInsert;
          const vertexId = {
            clientId: insertMsg.vertexClientId,
            lamportTime: insertMsg.vertexLamport,
          };
          const parentId = {
            clientId: insertMsg.parentClientId,
            lamportTime: insertMsg.parentLamport,
          };
          queuedOp = {
            type: 'insert' as const,
            lamportTime: insertMsg.lamportTime,
            clientId: insertMsg.clientId,
            vertexId: vertexId,
            char: insertMsg.char,
            parentId: parentId,
          };
        } else {
          const deleteMsg = msg as BinaryDelete;
          const vertexId = {
            clientId: deleteMsg.vertexClientId,
            lamportTime: deleteMsg.vertexLamport,
          };
          queuedOp = {
            type: 'delete' as const,
            lamportTime: deleteMsg.lamportTime,
            clientId: deleteMsg.clientId,
            vertexId: vertexId,
          };
        }
        opQueue.enqueue(queuedOp);
        const readyOps = opQueue.process();
        for (const op of readyOps) {
          if (op.type === 'insert' && op.vertexId && op.char && op.parentId) {
            rga.updateClock(op.lamportTime);
            rga.insertWithId(op.char, op.parentId, op.vertexId);
          } else if (op.type === 'delete' && op.vertexId) {
            rga.updateClock(op.lamportTime);
            rga.delete(op.vertexId);
          }
        }
        if (readyOps.length > 0) {
          updateText();
        }
      } else {
        if (msg.type === MessageType.CURSOR) {
          const cursorMsg = msg as BinaryCursor;
          setRemoteCursors(prev => {
            const newMap = new Map(prev);
            newMap.set(cursorMsg.clientId, cursorMsg.position);
            return newMap;
          });
        }
      }
    };

    onMessage('all', handleBinaryMessage);
  }, [onMessage, rga, updateText, wsClientId, opQueue]);

  // --- Flush offline queue ---
  useEffect(() => {
    const flushPending = async () => {
      if (!isConnected || !isInitialized) return;
      const pending = await offlineStorage.getPendingOperations();
      if (pending.length === 0) return;

      console.log(`📤 Flushing ${pending.length} offline operations...`);
      for (const op of pending) {
        applyBinaryMessage(op);
        sendBinary(op);
      }
      await offlineStorage.clearPendingOperations();
      console.log('✅ Offline queue flushed.');
    };

    flushPending();
  }, [isConnected, isInitialized, sendBinary, applyBinaryMessage]);

  // --- Send cursor ---
  const sendCursorPosition = useCallback(() => {
    if (textareaRef.current && isConnected && wsClientId !== null) {
      const pos = textareaRef.current.selectionStart;
      const cursorMsg: BinaryCursor = {
        type: MessageType.CURSOR,
        clientId: wsClientId,
        lamportTime: rga.nextLamport(),
        position: pos,
      };
      sendBinary(cursorMsg);
    }
  }, [sendBinary, isConnected, wsClientId, rga]);

  // --- Local insert ---
  const localInsertChar = useCallback(async (char: string, parentId: VertexId) => {
    const vertex = insertChar(char, parentId);
    history.push({ type: 'insert', vertex });
    const binaryMsg: BinaryInsert = {
      type: MessageType.INSERT,
      clientId: wsClientId || effectiveClientId,
      lamportTime: vertex.id.lamportTime,
      parentClientId: parentId.clientId,
      parentLamport: parentId.lamportTime,
      vertexClientId: vertex.id.clientId,
      vertexLamport: vertex.id.lamportTime,
      char: char,
    };
    if (isConnected) {
      sendBinary(binaryMsg);
    } else {
      await offlineStorage.saveOperation(binaryMsg);
    }
    return vertex;
  }, [insertChar, sendBinary, wsClientId, effectiveClientId, isConnected, history]);

  // --- Local delete ---
  const localDeleteChar = useCallback(async (vertexId: VertexId) => {
    const ordered = rga.getOrderedVertices();
    const idx = ordered.findIndex(v =>
      v.id.clientId === vertexId.clientId && v.id.lamportTime === vertexId.lamportTime
    );
    const vertex = idx !== -1 ? ordered[idx] : undefined;
    if (!vertex) return;
    history.push({ type: 'delete', vertex });
    deleteChar(vertexId);
    const binaryMsg: BinaryDelete = {
      type: MessageType.DELETE,
      clientId: wsClientId || effectiveClientId,
      lamportTime: rga.nextLamport(),
      vertexClientId: vertexId.clientId,
      vertexLamport: vertexId.lamportTime,
    };
    if (isConnected) {
      sendBinary(binaryMsg);
    } else {
      await offlineStorage.saveOperation(binaryMsg);
    }
  }, [deleteChar, sendBinary, wsClientId, effectiveClientId, rga, isConnected, history]);

  // --- Insert with ID (for redo / undo of delete) ---
  const localInsertWithId = useCallback(async (char: string, parentId: VertexId, id: VertexId) => {
    const vertex = rga.insertWithId(char, parentId, id);
    const binaryMsg: BinaryInsert = {
      type: MessageType.INSERT,
      clientId: wsClientId || effectiveClientId,
      lamportTime: id.lamportTime,
      parentClientId: parentId.clientId,
      parentLamport: parentId.lamportTime,
      vertexClientId: id.clientId,
      vertexLamport: id.lamportTime,
      char: char,
    };
    if (isConnected) {
      sendBinary(binaryMsg);
    } else {
      await offlineStorage.saveOperation(binaryMsg);
    }
    updateText();
    return vertex;
  }, [rga, sendBinary, wsClientId, effectiveClientId, isConnected, updateText]);

  // --- Undo ---
  const performUndo = useCallback(async () => {
    if (!history.canUndo()) return;
    const entry = history.popUndo();
    if (!entry) return;

    await history.withRecordingOff(async () => {
      if (entry.type === 'insert' && entry.vertex) {
        await localDeleteChar(entry.vertex.id);
      } else if (entry.type === 'delete' && entry.vertex) {
        const vertex = entry.vertex;
        await localInsertWithId(vertex.char, vertex.parentId, vertex.id);
      }
    });
    if (entry.type === 'insert' && entry.vertex) {
      history.pushRedo({ type: 'delete', vertex: entry.vertex });
    } else if (entry.type === 'delete' && entry.vertex) {
      history.pushRedo({ type: 'insert', vertex: entry.vertex });
    }
  }, [history, localDeleteChar, localInsertWithId]);

  // --- Redo ---
  const performRedo = useCallback(async () => {
    if (!history.canRedo()) return;
    const entry = history.popRedo();
    if (!entry) return;

    await history.withRecordingOff(async () => {
      if (entry.type === 'insert' && entry.vertex) {
        await localInsertWithId(entry.vertex.char, entry.vertex.parentId, entry.vertex.id);
      } else if (entry.type === 'delete' && entry.vertex) {
        await localDeleteChar(entry.vertex.id);
      }
    });
    history.push(entry);
  }, [history, localInsertWithId, localDeleteChar]);

    // --- Keyboard shortcuts (FIXED) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          performRedo();
        } else {
          e.preventDefault();
          performUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [performUndo, performRedo]);
  
  // --- Sync textarea ---
  useEffect(() => {
    if (textareaRef.current && !isInternalUpdate.current) {
      const cursorPos = textareaRef.current.selectionStart;
      textareaRef.current.value = text;
      textareaRef.current.selectionStart = Math.min(cursorPos, text.length);
      textareaRef.current.selectionEnd = Math.min(cursorPos, text.length);
    }
    isInternalUpdate.current = false;
  }, [text]);

  // --- User input ---
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

  // --- Enter key ---
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
            {isConnected ? '● Live' : '📴 Offline'}
          </span>
          <span className="text-xs text-slate-500 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full">
            👥 {remoteCursors.size + 1} online
          </span>
          <span className="text-xs text-slate-500 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full">
            {history.canUndo() ? '↩️' : '—'}
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