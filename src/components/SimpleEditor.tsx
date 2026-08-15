// src/components/SimpleEditor.tsx
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useCRDT } from '../hooks/useCRDT';
import { ROOT_ID } from '../crdt/types';
import { useWebSocket } from '../context/WebSocketContext';
import { OperationQueue } from '../crdt/OperationQueue';
import { HistoryManager } from '../crdt/HistoryManager';
import { MessageType, BinaryInsert, BinaryDelete, BinaryCursor } from '../network';
import { offlineStorage } from '../services/OfflineStorage';

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
  const [docTitle, setDocTitle] = useState('Product Specification — CanvasSync Alpha');
  const [copied, setCopied] = useState(false);

  const { clientId: wsClientId, sendBinary, onMessage, isConnected } = useWebSocket();
  const effectiveClientId = wsClientId || clientId;

  // --- Initialize offline storage ---
  useEffect(() => {
    const init = async () => {
      await offlineStorage.init();
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
      } else if (msg.type === MessageType.CURSOR) {
        applyBinaryMessage(msg);
      }
    };

    onMessage('all', handleBinaryMessage);
  }, [onMessage, wsClientId, applyBinaryMessage, opQueue, rga, updateText]);

  // --- Send cursor position to peers ---
  const sendCursorPosition = useCallback(() => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const cursorMsg: BinaryCursor = {
      type: MessageType.CURSOR,
      clientId: effectiveClientId,
      position: pos,
    };
    sendBinary(cursorMsg);
  }, [effectiveClientId, sendBinary]);

  // --- Local operations ---
  const localInsertChar = useCallback((char: string, parentId: any) => {
    const vId = insertChar(char, parentId);
    history.recordInsert(char, vId, parentId);
    offlineStorage.saveText(text + char).catch(console.error);

    const insertMsg: BinaryInsert = {
      type: MessageType.INSERT,
      clientId: effectiveClientId,
      lamportTime: vId.lamportTime,
      char,
      parentClientId: parentId.clientId,
      parentLamport: parentId.lamportTime,
      vertexClientId: vId.clientId,
      vertexLamport: vId.lamportTime,
    };
    sendBinary(insertMsg);
  }, [insertChar, history, text, effectiveClientId, sendBinary]);

  const localDeleteChar = useCallback((vertexId: any) => {
    const vertex = rga.find(vertexId);
    if (vertex) {
      history.recordDelete(vertex.value, vertexId);
    }
    deleteChar(vertexId);
    offlineStorage.saveText(text.slice(0, -1)).catch(console.error);

    const deleteMsg: BinaryDelete = {
      type: MessageType.DELETE,
      clientId: effectiveClientId,
      lamportTime: rga.getClock(),
      vertexClientId: vertexId.clientId,
      vertexLamport: vertexId.lamportTime,
    };
    sendBinary(deleteMsg);
  }, [deleteChar, history, rga, text, effectiveClientId, sendBinary]);

  // --- Sync textarea value ---
  useEffect(() => {
    if (textareaRef.current && !isInternalUpdate.current) {
      const prevStart = textareaRef.current.selectionStart;
      const prevEnd = textareaRef.current.selectionEnd;
      textareaRef.current.value = text;
      textareaRef.current.selectionStart = prevStart;
      textareaRef.current.selectionEnd = prevEnd;
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

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* ─── Top Studio Toolbar ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
        
        {/* Document Title & Status */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            className="font-sans font-semibold text-slate-900 text-base md:text-lg bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-colors px-1 py-0.5"
          />
        </div>

        {/* Telemetry Status Pills */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Connection Status */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-medium border shadow-xs ${
            isConnected 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' 
              : 'bg-amber-50 text-amber-700 border-amber-200/80'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {isConnected ? 'Live Synced' : 'Offline Mode'}
          </span>

          {/* Peer Count */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs text-slate-700 bg-white/80 border border-slate-200/80 shadow-xs">
            <span className="text-blue-600 font-bold">👥 {remoteCursors.size + 1}</span> active
          </span>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="px-3.5 py-1 rounded-full font-mono text-xs font-medium text-slate-700 hover:text-blue-600 bg-white/80 hover:bg-white border border-slate-200/80 transition-all shadow-xs active:scale-95 flex items-center gap-1"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>

      {/* ─── Pristine Document Writing Paper Canvas ─── */}
      <div className="relative w-full rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50 transition-all">
        
        {/* Paper Header Margin */}
        <div className="px-8 py-3 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between font-mono text-[11px] text-slate-500 select-none">
          <div className="flex items-center gap-4">
            <span>{wordCount} words</span>
            <span>{text.length} characters</span>
            <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-semibold">RGA CRDT Engine</span>
            <span>·</span>
            <span>Conflict-Free</span>
          </div>
        </div>

        {/* Textarea Surface */}
        <textarea
          ref={textareaRef}
          defaultValue={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSelect={sendCursorPosition}
          onClick={sendCursorPosition}
          className="w-full min-h-[500px] p-8 font-sans text-base md:text-lg leading-relaxed text-slate-900 placeholder:text-slate-400 bg-transparent outline-none resize-none selection:bg-blue-100 selection:text-blue-900"
          placeholder="Start typing your collaborative document here... All edits converge in real-time across peers with zero conflict."
          style={{ lineHeight: '1.85' }}
        />

        {/* Active Remote Cursors Floating Indicator */}
        {remoteCursors.size > 0 && (
          <div className="px-6 py-2.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-mono text-slate-600">
            {Array.from(remoteCursors.entries()).map(([id, pos]) => (
              <span key={id} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                User #{id} at index {pos}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ─── Bottom Telemetry & Info ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 text-xs font-mono text-slate-500">
        <span>✓ Instant local IndexedDB persistence active</span>
        <span>Peer-to-Peer WebRTC Mesh · Deterministic Ordering</span>
      </div>
    </div>
  );
};

export default SimpleEditor;