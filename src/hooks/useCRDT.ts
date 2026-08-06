// src/hooks/useCRDT.ts
import { useState, useCallback, useEffect } from 'react';
import { RGA } from '../crdt/RGA';
import type { VertexId } from '../crdt/types';

export function useCRDT(clientId: number) {
  const [rga] = useState(() => new RGA(clientId));
  const [text, setText] = useState('');
  const [verticesCount, setVerticesCount] = useState(0);
  const [tombstonesCount, setTombstonesCount] = useState(0);

  const updateStats = useCallback(() => {
    const ordered = rga.getOrderedVertices();
    const tombstones = ordered.filter(v => v.isTombstone).length;
    setVerticesCount(ordered.length);
    setTombstonesCount(tombstones);
  }, [rga]);

  const updateText = useCallback(() => {
    setText(rga.toText());
    updateStats();
  }, [rga, updateStats]);

  // Initial sync
  useEffect(() => {
    updateText();
  }, [updateText]);

  const insertChar = useCallback((char: string, parentId: VertexId) => {
    const vertex = rga.insert(char, parentId);
    updateText();
    return vertex;
  }, [rga, updateText]);

  const deleteChar = useCallback((vertexId: VertexId) => {
    rga.delete(vertexId);
    updateText();
  }, [rga, updateText]);

  const getHead = useCallback(() => {
    return rga.getHead();
  }, [rga]);

  const getVertexAt = useCallback((index: number) => {
    return rga.getVertexAt(index);
  }, [rga]);

  return { 
    rga, 
    text, 
    verticesCount,
    tombstonesCount,
    insertChar, 
    deleteChar,
    getHead,
    getVertexAt,
    updateText
  };
}