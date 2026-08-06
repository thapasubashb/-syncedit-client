// src/components/SimpleEditor.tsx
import React, { useCallback, useRef, useEffect } from 'react';
import { useCRDT } from '../hooks/useCRDT';
import { ROOT_ID } from '../crdt/types';

interface EditorProps {
  clientId: number;
}

const SimpleEditor: React.FC<EditorProps> = ({ clientId }) => {
  const { text, verticesCount, tombstonesCount, insertChar, deleteChar, getVertexAt, getHead } = useCRDT(clientId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInternalUpdate = useRef(false);

  // Update textarea when CRDT changes
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
        insertChar(char, parentId);
      }
    } else if (newText.length < oldText.length) {
      // Deletion
      const pos = cursorPos;
      const vertex = getVertexAt(pos);
      if (vertex) {
        deleteChar(vertex.id);
      }
    }
  }, [text, insertChar, deleteChar, getVertexAt, getHead]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const pos = e.currentTarget.selectionStart;
      const vertex = pos === 0 ? getHead() : getVertexAt(pos - 1);
      const parentId = vertex ? vertex.id : ROOT_ID;
      insertChar('\n', parentId);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = pos + 1;
          textareaRef.current.selectionEnd = pos + 1;
        }
      }, 0);
    }
  }, [insertChar, getVertexAt, getHead]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden transition-all hover:shadow-2xl">
      {/* Toolbar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="font-medium text-gray-700">📄 Editor</span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">
            Characters: <span className="font-mono font-semibold text-blue-600">{text.length}</span>
          </span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
            Vertices: <span className="font-mono">{verticesCount}</span>
            <span className="text-gray-300 mx-1">·</span>
            Tombstones: <span className="font-mono text-orange-500">{tombstonesCount}</span>
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Client <span className="font-mono text-gray-600 bg-gray-200/50 px-2 py-0.5 rounded">{clientId}</span>
        </div>
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        defaultValue={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full min-h-[450px] p-5 font-mono text-base border-0 outline-none resize-none focus:ring-0 bg-white text-gray-800"
        placeholder="Start typing..."
        style={{ 
          lineHeight: '1.8',
          resize: 'none',
        }}
      />

      {/* Status Bar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200/50 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Connected
          </span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="hidden sm:inline">CRDT: RGA</span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="hidden sm:inline">Lamport Clock: <span className="font-mono">{useCRDT(clientId).rga.nextLamport() - 1}</span></span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <kbd className="px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-600 text-xs font-mono shadow-sm">Ctrl+Z</kbd>
          <span className="mx-0.5">Undo</span>
          <span className="text-gray-300 mx-1">·</span>
          <kbd className="px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-600 text-xs font-mono shadow-sm">Ctrl+Shift+Z</kbd>
          <span className="ml-0.5">Redo</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleEditor;