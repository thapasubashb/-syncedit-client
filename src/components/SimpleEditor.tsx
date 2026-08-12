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
  const [documentId] = useState('default');

  const { clientId: wsClientId, sendBinary, onMessage, isConnected } = useWebSocket();

  // --- History helpers ---
  const pushHistory = (entry: { type: 'insert' | 'delete'; vertex?: Vertex; vertexId?: VertexId }) => {
    history.push(entry);
  };

  // --- Undo / Redo ---
  const performUndo = useCallback(() => {
    if (!history.canUndo()) return;
    const entry = history.popUndo();
    if (!entry) return;

    history.withRecordingOff(() => {
      if (entry.type === 'insert' && entry.vertex) {
        localDeleteChar(entry.vertex.id);
      } else if (entry.type === 'delete' && entry.vertex) {
        localInsertWithId(entry.vertex.char, entry.vertex.parentId, entry.vertex.id);
      }
    });
    if (entry.type === 'insert' && entry.vertex) {
      history.pushRedo({ type: 'delete', vertex: entry.vertex });
    } else if (entry.type === 'delete' && entry.vertex) {
      history.pushRedo({ type: 'insert', vertex: entry.vertex });
    }
  }, [history]);

  const performRedo = useCallback(() => {
    if (!history.canRedo()) return;
    const entry = history.popRedo();
    if (!entry) return;

    history.withRecordingOff(() => {
      if (entry.type === 'insert' && entry.vertex) {
        localInsertWithId(entry.vertex.char, entry.vertex.parentId, entry.vertex.id);
      } else if (entry.type === 'delete' && entry.vertex) {
        localDeleteChar(entry.vertex.id);
      }
    });
    history.push(entry);
  }, [history]);

  // --- Keyboard shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
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

  // --- Offline sync on reconnect ---
  useEffect(() => {
    if (isConnected && wsClientId !== null) {
      const syncOfflineOps = async () => {
        const unsynced = await offlineStorage.getUnsyncedOperations(documentId);
        if (unsynced.length === 0) return;
        console.log(`📤 Syncing ${unsynced.length} offline operations...`);
        const idsToMark: string[] = [];
        for (const item of unsynced) {
          const op = item.operation;
          if (op.type === MessageType.INSERT) {
            const binaryMsg: BinaryInsert = {
              type: MessageType.INSERT,
              clientId: op.clientId,
              lamportTime: op.lamportTime,
              parentClientId: op.parentClientId,
              parentLamport: op.parentLamport,
              vertexClientId: op.vertexClientId,
              vertexLamport: op.vertexLamport,
              char: op.char,
            };
            sendBinary(binaryMsg);
          } else if (op.type === MessageType.DELETE) {
            const binaryMsg: BinaryDelete = {
              type: MessageType.DELETE,
              clientId: op.clientId,
              lamportTime: op.lamportTime,
              vertexClientId: op.vertexClientId,
              vertexLamport: op.vertexLamport,
            };
            sendBinary(binaryMsg);
          }
          idsToMark.push(item.id);
        }
        await offlineStorage.markSynced(idsToMark);
        console.log(`✅ Synced ${idsToMark.length} offline operations.`);
      };
      syncOfflineOps();
    }
  }, [isConnected, wsClientId, documentId, sendBinary]);

  // --- Save operation offline if not connected ---
  const saveOperationOffline = useCallback(async (operation: any) => {
    if (!isConnected) {
      await offlineStorage.saveOperation(operation, documentId);
    }
  }, [isConnected, documentId]);

  // --- Broadcast / sync methods ---
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

  // --- Binary message handler ---
  useEffect(() => {
    const handleBinaryMessage = (msg: any) => {
      if (msg.clientId === wsClientId) return;

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
        }
      } else if (msg.type === MessageType.DELETE) {
        const deleteMsg = msg as BinaryDelete;
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
        }
      } else if (msg.type === MessageType.CURSOR) {
        const cursorMsg = msg as BinaryCursor;
        setRemoteCursors(prev => {
          const newMap = new Map(prev);
          newMap.set(cursorMsg.clientId, cursorMsg.position);
          return newMap;
        });
      }
    };

    onMessage('all', handleBinaryMessage);
  }, [onMessage, rga, updateText, wsClientId, opQueue]);

  // --- Local operations with history and offline ---
  const localInsertChar = useCallback((char: string, parentId: VertexId) => {
    const vertex = insertChar(char, parentId);
    pushHistory({ type: 'insert', vertex });
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
      if (isConnected) {
        sendBinary(binaryMsg);
      } else {
        saveOperationOffline(binaryMsg);
      }
    } else {
      const binaryMsg: BinaryInsert = {
        type: MessageType.INSERT,
        clientId: clientId,
        lamportTime: vertex.id.lamportTime,
        parentClientId: parentId.clientId,
        parentLamport: parentId.lamportTime,
        vertexClientId: vertex.id.clientId,
        vertexLamport: vertex.id.lamportTime,
        char: char,
      };
      saveOperationOffline(binaryMsg);
    }
    return vertex;
  }, [insertChar, sendBinary, wsClientId, isConnected, saveOperationOffline, clientId]);

  const localDeleteChar = useCallback((vertexId: VertexId) => {
    // Find vertex for history
    const ordered = rga.getOrderedVertices();
    const vertex = ordered.find(v => v.id.clientId === vertexId.clientId && v.id.lamportTime === vertexId.lamportTime);
    if (!vertex) return;
    pushHistory({ type: 'delete', vertex });
    deleteChar(vertexId);
    if (wsClientId !== null) {
      const binaryMsg: BinaryDelete = {
        type: MessageType.DELETE,
        clientId: wsClientId,
        lamportTime: rga.nextLamport(),
        vertexClientId: vertexId.clientId,
        vertexLamport: vertexId.lamportTime,
      };
      if (isConnected) {
        sendBinary(binaryMsg);
      } else {
        saveOperationOffline(binaryMsg);
      }
    } else {
      const binaryMsg: BinaryDelete = {
        type: MessageType.DELETE,
        clientId: clientId,
        lamportTime: rga.nextLamport(),
        vertexClientId: vertexId.clientId,
        vertexLamport: vertexId.lamportTime,
      };
      saveOperationOffline(binaryMsg);
    }
  }, [deleteChar, sendBinary, wsClientId, isConnected, saveOperationOffline, clientId, rga]);

  const localInsertWithId = useCallback((char: string, parentId: VertexId, id: VertexId) => {
    const vertex = rga.insertWithId(char, parentId, id);
    if (wsClientId !== null) {
      const binaryMsg: BinaryInsert = {
        type: MessageType.INSERT,
        clientId: wsClientId,
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
        saveOperationOffline(binaryMsg);
      }
    } else {
      const binaryMsg: BinaryInsert = {
        type: MessageType.INSERT,
        clientId: clientId,
        lamportTime: id.lamportTime,
        parentClientId: parentId.clientId,
        parentLamport: parentId.lamportTime,
        vertexClientId: id.clientId,
        vertexLamport: id.lamportTime,
        char: char,
      };
      saveOperationOffline(binaryMsg);
    }
    updateText();
    return vertex;
  }, [rga, sendBinary, wsClientId, isConnected, saveOperationOffline, clientId, updateText]);

  // --- Textarea sync ---
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

  // --- Render ---
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