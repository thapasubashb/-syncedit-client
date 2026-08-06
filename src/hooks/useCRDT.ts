// src/hooks/useCRDT.ts
import { useState, useCallback } from 'react';
import { RGA } from '../crdt/RGA';
import type { VertexId } from '../crdt/types';
// ROOT_ID not used in this hook

export function useCRDT(clientId: number) {
  const [rga] = useState(() => new RGA(clientId));
  const [text, setText] = useState('');

  // Update text whenever CRDT changes
  const updateText = useCallback(() => {
    setText(rga.toText());
  }, [rga]);

  // Insert a character
  const insertChar = useCallback((char: string, parentId: VertexId) => {
    const vertex = rga.insert(char, parentId);
    updateText();
    return vertex;
  }, [rga, updateText]);

  // Delete a character (by its ID)
  const deleteChar = useCallback((vertexId: VertexId) => {
    rga.delete(vertexId);
    updateText();
  }, [rga, updateText]);

  // Get the root/head vertex
  const getHead = useCallback(() => {
    return rga.getHead();
  }, [rga]);

  // Get vertex at a specific position
  const getVertexAt = useCallback((index: number) => {
    return rga.getVertexAt(index);
  }, [rga]);

  return { 
    rga, 
    text, 
    insertChar, 
    deleteChar,
    getHead,
    getVertexAt,
    updateText
  };
}