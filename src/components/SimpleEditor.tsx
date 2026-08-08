// src/components/SimpleEditor.tsx
import React, { useCallback, useRef, useEffect } from 'react';
import { useCRDT } from '../hooks/useCRDT';
import { ROOT_ID } from '../crdt/types';
import { useWebSocket } from '../context/WebSocketContext';
import type { VertexId, Vertex } from '../crdt/types';

interface EditorProps {
  clientId: number;
}

const SimpleEditor: React.FC<EditorProps> = ({ clientId }) => {
  const { rga, text, insertChar, deleteChar, getVertexAt, getHead, updateText } = useCRDT(clientId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInternalUpdate = useRef(false);
  
  // 🔗 WebSocket
  const { sendMessage, onMessage, isConnected } = useWebSocket();

  // --- Helper: Send operation to WebSocket ---
  const sendOperation = useCallback((opType: 'insert' | 'delete', data: any) => {
    if (isConnected) {
      sendMessage({
        type: 'operation',
        operation: {
          type: opType,
          ...data
        }
      });
    }
  }, [isConnected, sendMessage]);

  // --- Remote operation handler ---
  useEffect(() => {
    const handleRemoteOperation = (message: any) => {
      const { operation } = message;
      if (!operation) return;

      // Apply remote operation to local CRDT
      if (operation.type === 'insert') {
        const { vertex } = operation;
        if (vertex) {
          // Use insertWithId to preserve remote ID
          rga.insertWithId(vertex.char, vertex.parentId, vertex.id);
          updateText(); // refresh UI
          console.log('📥 Remote insert applied');
        }
      } else if (operation.type === 'delete') {
        const { vertexId } = operation;
        if (vertexId) {
          rga.delete(vertexId);
          updateText(); // refresh UI
          console.log('📥 Remote delete applied');
        }
      }
    };

    onMessage('operation', handleRemoteOperation);
    // Cleanup: remove listener if needed (optional)
  }, [onMessage, rga, updateText]);

  // --- Local insert (overrides the original insertChar) ---
  const localInsertChar = useCallback((char: string, parentId: VertexId) => {
    // 1. Insert locally
    const vertex = insertChar(char, parentId);
    // 2. Send to WebSocket
    sendOperation('insert', { vertex });
    return vertex;
  }, [insertChar, sendOperation]);

  // --- Local delete (overrides original deleteChar) ---
  const localDeleteChar = useCallback((vertexId: VertexId) => {
    // 1. Delete locally
    deleteChar(vertexId);
    // 2. Send to WebSocket
    sendOperation('delete', { vertexId });
  }, [deleteChar, sendOperation]);

  // --- Textarea update on CRDT change ---
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
      // Insertion
      const pos = cursorPos - 1;
      const char = newText[pos];
      if (char) {
        const vertex = pos === 0 ? getHead() : getVertexAt(pos - 1);
        const parentId = vertex ? vertex.id : ROOT_ID;
        localInsertChar(char, parentId);
        // Move cursor forward
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = pos + 1;
            textareaRef.current.selectionEnd = pos + 1;
          }
        }, 0);
      }
    } else if (newText.length < oldText.length) {
      // Deletion
      const pos = cursorPos;
      const vertex = getVertexAt(pos);
      if (vertex) {
        localDeleteChar(vertex.id);
        // Keep cursor at same position
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
    <div className="min-h-[450px]">
      <textarea
        ref={textareaRef}
        defaultValue={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full min-h-[450px] p-5 font-mono text-base border-0 outline-none resize-none bg-transparent text-gray-800"
        placeholder="Start typing..."
        style={{ lineHeight: '1.8', resize: 'none' }}
      />
      <div className="text-xs text-gray-500 mt-2 flex justify-between">
        <span>Characters: {text.length}</span>
        <span>WebSocket: {isConnected ? '✅ Connected' : '❌ Disconnected'}</span>
      </div>
    </div>
  );
};

export default SimpleEditor;