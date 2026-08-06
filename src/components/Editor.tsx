// src/components/Editor.tsx
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { createEditor, Descendant, BaseEditor } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { useCRDT } from '../hooks/useCRDT';
import { ROOT_ID } from '../crdt/types';

// Define custom types for Slate
type CustomElement = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string };

// Extend Slate's types
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface EditorProps {
  clientId: number;
}

const EditorComponent: React.FC<EditorProps> = ({ clientId }) => {
  const { text, insertChar, deleteChar, getVertexAt, getHead } = useCRDT(clientId);
  const editor = useMemo(() => withReact(createEditor()), []);
  const editorRef = useRef(editor);

  // Convert plain text to Slate document (single paragraph)
  const slateValue: Descendant[] = useMemo(() => {
    return [{ type: 'paragraph', children: [{ text }] }];
  }, [text]);

  // Handle key down events
  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Prevent default to avoid Slate's built-in mutations
    event.preventDefault();

    const editorInstance = editorRef.current;
    const { selection } = editorInstance;

    if (!selection) {
      // If there's no selection, place cursor at the beginning
      const startPoint = { path: [0, 0], offset: 0 };
      editorInstance.selection = { anchor: startPoint, focus: startPoint };
      return;
    }

    const currentOffset = selection.anchor.offset;
    const textLength = text.length;

    if (event.key === 'Backspace') {
      if (currentOffset > 0) {
        const pos = currentOffset - 1;
        const vertex = getVertexAt(pos);
        if (vertex) {
          deleteChar(vertex.id);
          const newPoint = { path: [0, 0], offset: pos };
          editorInstance.selection = { anchor: newPoint, focus: newPoint };
        }
      }
      return;
    }

    if (event.key === 'Delete') {
      if (currentOffset < textLength) {
        const vertex = getVertexAt(currentOffset);
        if (vertex) {
          deleteChar(vertex.id);
          const newPoint = { path: [0, 0], offset: currentOffset };
          editorInstance.selection = { anchor: newPoint, focus: newPoint };
        }
      }
      return;
    }

    if (event.key === 'ArrowLeft') {
      if (currentOffset > 0) {
        const newPoint = { path: [0, 0], offset: currentOffset - 1 };
        editorInstance.selection = { anchor: newPoint, focus: newPoint };
      }
      return;
    }

    if (event.key === 'ArrowRight') {
      if (currentOffset < textLength) {
        const newPoint = { path: [0, 0], offset: currentOffset + 1 };
        editorInstance.selection = { anchor: newPoint, focus: newPoint };
      }
      return;
    }

    if (event.key === 'Enter') {
      const vertex = getVertexAt(currentOffset - 1);
      const parentId = vertex ? vertex.id : ROOT_ID;
      insertChar('\n', parentId);
      const newPoint = { path: [0, 0], offset: currentOffset + 1 };
      editorInstance.selection = { anchor: newPoint, focus: newPoint };
      return;
    }

    // Insert regular characters
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      const vertex = currentOffset === 0 ? getHead() : getVertexAt(currentOffset - 1);
      const parentId = vertex ? vertex.id : ROOT_ID;
      insertChar(event.key, parentId);
      const newPoint = { path: [0, 0], offset: currentOffset + 1 };
      editorInstance.selection = { anchor: newPoint, focus: newPoint };
    }
  }, [text, insertChar, deleteChar, getVertexAt, getHead]);

  // Update editor selection when text changes
  useEffect(() => {
    const editorInstance = editorRef.current;
    if (editorInstance.selection) {
      const currentOffset = editorInstance.selection.anchor.offset;
      const textLength = text.length;
      if (currentOffset > textLength) {
        const newPoint = { path: [0, 0], offset: textLength };
        editorInstance.selection = { anchor: newPoint, focus: newPoint };
      }
    }
  }, [text]);

  // Handle selection change
  const onSelectionChange = useCallback(() => {
    // We'll handle cursor position updates here later
  }, []);

  return (
    <div 
      style={{ 
        border: '1px solid #ddd', 
        padding: '16px', 
        minHeight: '200px',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Slate editor={editor} value={slateValue} onChange={onSelectionChange}>
        <Editable
          onKeyDown={onKeyDown}
          placeholder="Start typing..."
          style={{ 
            outline: 'none',
            fontSize: '16px',
            lineHeight: '1.6',
            minHeight: '150px'
          }}
        />
      </Slate>
      <div style={{ 
        marginTop: '12px', 
        fontSize: '12px', 
        color: '#999',
        borderTop: '1px solid #eee',
        paddingTop: '8px'
      }}>
        Characters: {text.length}
      </div>
    </div>
  );
};

export default EditorComponent;