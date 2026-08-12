// src/components/Whiteboard.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { ShapeCRDT } from '../crdt/ShapeCRDT';
import { ShapeVertex, ShapeData, ShapeVertexId } from '../crdt/shapeTypes';
import { useWebSocket } from '../context/WebSocketContext';
import { MessageType, BinaryInsert, BinaryDelete } from '../network';

interface WhiteboardProps {
  clientId: number;
  shapeCRDT: ShapeCRDT;
  onShapeUpdate: () => void;
}

type Tool = 'select' | 'rectangle' | 'circle' | 'line' | 'pen';

const Whiteboard: React.FC<WhiteboardProps> = ({ clientId, shapeCRDT, onShapeUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [currentTool, setCurrentTool] = useState<Tool>('select');
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [selectedFill, setSelectedFill] = useState('#FFD93D');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const isInternalUpdate = useRef(false);

  const { clientId: wsClientId, sendBinary, isConnected } = useWebSocket();
  const effectiveClientId = wsClientId || clientId;

  // --- Initialize Fabric Canvas ---
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: '#ffffff',
    });
    fabricCanvasRef.current = canvas;

    // Load existing shapes from CRDT
    const shapes = shapeCRDT.getOrderedShapes();
    for (const vertex of shapes) {
      renderShape(canvas, vertex);
    }

    // --- Event: shape added (new shape) ---
    canvas.on('object:added', (e) => {
      if (isInternalUpdate.current) return;
      const obj = e.target;
      if (!obj) return;

      const shapeData = fabricToShapeData(obj);
      if (!shapeData) return;

      const parentId: ShapeVertexId = { clientId: 0, lamportTime: 0 };
      const vertex = shapeCRDT.insertShape(shapeData, parentId);
      onShapeUpdate();

      // Broadcast via binary protocol
      const binaryMsg: BinaryInsert = {
        type: MessageType.INSERT,
        clientId: effectiveClientId,
        lamportTime: vertex.id.lamportTime,
        parentClientId: 0,
        parentLamport: 0,
        vertexClientId: vertex.id.clientId,
        vertexLamport: vertex.id.lamportTime,
        char: '', // not used for shapes
      };
      // We'll send shape data separately – for now, we store in a separate message.
      // For simplicity, we'll broadcast the shape data as a JSON payload via the same binary channel.
      // We'll extend the binary protocol later.
      // For now, we'll use the existing sendBinary with a shape payload.
      // But since our binary protocol doesn't support shapes yet, we'll send as JSON fallback.
      sendBinary(JSON.stringify({
        type: 'shape_insert',
        vertex,
      }));
    });

    // --- Event: object modified (update) ---
    canvas.on('object:modified', (e) => {
      if (isInternalUpdate.current) return;
      const obj = e.target;
      if (!obj) return;

      // Find the vertex ID from the object's custom data
      const vertexId = (obj as any).vertexId;
      if (!vertexId) return;

      const shapeData = fabricToShapeData(obj);
      if (!shapeData) return;

      shapeCRDT.updateShape(vertexId, shapeData);
      onShapeUpdate();

      sendBinary(JSON.stringify({
        type: 'shape_update',
        vertexId,
        shapeData,
      }));
    });

    // --- Event: object removed ---
    canvas.on('object:removed', (e) => {
      if (isInternalUpdate.current) return;
      const obj = e.target;
      if (!obj) return;

      const vertexId = (obj as any).vertexId;
      if (!vertexId) return;

      shapeCRDT.deleteShape(vertexId);
      onShapeUpdate();

      sendBinary(JSON.stringify({
        type: 'shape_delete',
        vertexId,
      }));
    });

    // Cleanup
    return () => {
      canvas.dispose();
    };
  }, []);

  // --- Helper: Convert fabric object to ShapeData ---
  const fabricToShapeData = (obj: fabric.Object): ShapeData | null => {
    const type = obj.type as string;
    const base = {
      x: obj.left || 0,
      y: obj.top || 0,
      width: obj.width || 0,
      height: obj.height || 0,
      color: obj.stroke as string || '#000000',
      fill: obj.fill as string || '#FFFFFF',
      strokeWidth: obj.strokeWidth || 1,
      rotation: obj.angle || 0,
    };

    if (type === 'rect') {
      return { ...base, type: 'rectangle' };
    } else if (type === 'circle') {
      return { ...base, type: 'circle' };
    } else if (type === 'line') {
      const line = obj as fabric.Line;
      return {
        ...base,
        type: 'line',
        points: [
          { x: line.x1 || 0, y: line.y1 || 0 },
          { x: line.x2 || 0, y: line.y2 || 0 },
        ],
      };
    } else if (type === 'path') {
      // For pen/freehand – simplified as path
      return {
        ...base,
        type: 'pen',
        points: [],
      };
    } else if (type === 'i-text' || type === 'textbox') {
      return {
        ...base,
        type: 'textbox',
        text: (obj as fabric.Textbox).text || '',
      };
    }
    return null;
  };

  // --- Render a shape from a vertex ---
  const renderShape = (canvas: fabric.Canvas, vertex: ShapeVertex) => {
    isInternalUpdate.current = true;
    const data = vertex.shapeData;
    let obj: fabric.Object | null = null;

    switch (data.type) {
      case 'rectangle':
        obj = new fabric.Rect({
          left: data.x,
          top: data.y,
          width: data.width,
          height: data.height,
          fill: data.fill,
          stroke: data.color,
          strokeWidth: data.strokeWidth,
          angle: data.rotation,
        });
        break;
      case 'circle':
        obj = new fabric.Circle({
          left: data.x,
          top: data.y,
          radius: Math.min(data.width, data.height) / 2 || 20,
          fill: data.fill,
          stroke: data.color,
          strokeWidth: data.strokeWidth,
          angle: data.rotation,
        });
        break;
      case 'line':
        if (data.points && data.points.length >= 2) {
          obj = new fabric.Line([
            data.points[0].x, data.points[0].y,
            data.points[1].x, data.points[1].y,
          ], {
            stroke: data.color,
            strokeWidth: data.strokeWidth,
            angle: data.rotation,
          });
        }
        break;
      case 'pen':
        // Simplified as a path
        obj = new fabric.Path('M 0 0 L 10 10', {
          stroke: data.color,
          strokeWidth: data.strokeWidth,
          fill: 'transparent',
          left: data.x,
          top: data.y,
          angle: data.rotation,
        });
        break;
      case 'textbox':
        obj = new fabric.Textbox(data.text || '', {
          left: data.x,
          top: data.y,
          fontSize: 20,
          fill: data.color,
          stroke: data.color,
          strokeWidth: data.strokeWidth,
          angle: data.rotation,
        });
        break;
    }

    if (obj) {
      (obj as any).vertexId = vertex.id;
      canvas.add(obj);
    }
    isInternalUpdate.current = false;
  };

  // --- Tool handlers ---
  const addShape = (tool: Tool) => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;

    if (tool === 'rectangle') {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 80,
        height: 60,
        fill: selectedFill,
        stroke: selectedColor,
        strokeWidth: strokeWidth,
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
    } else if (tool === 'circle') {
      const circle = new fabric.Circle({
        left: 150,
        top: 150,
        radius: 30,
        fill: selectedFill,
        stroke: selectedColor,
        strokeWidth: strokeWidth,
      });
      canvas.add(circle);
      canvas.setActiveObject(circle);
    } else if (tool === 'line') {
      const line = new fabric.Line([50, 50, 150, 150], {
        stroke: selectedColor,
        strokeWidth: strokeWidth,
      });
      canvas.add(line);
      canvas.setActiveObject(line);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <button
          onClick={() => setCurrentTool('select')}
          className={`px-3 py-1 rounded ${currentTool === 'select' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          🖱️ Select
        </button>
        <button
          onClick={() => { setCurrentTool('rectangle'); addShape('rectangle'); }}
          className={`px-3 py-1 rounded ${currentTool === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          ⬜ Rect
        </button>
        <button
          onClick={() => { setCurrentTool('circle'); addShape('circle'); }}
          className={`px-3 py-1 rounded ${currentTool === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          ⭕ Circle
        </button>
        <button
          onClick={() => { setCurrentTool('line'); addShape('line'); }}
          className={`px-3 py-1 rounded ${currentTool === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          ╱ Line
        </button>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="w-8 h-8 rounded border"
        />
        <input
          type="color"
          value={selectedFill}
          onChange={(e) => setSelectedFill(e.target.value)}
          className="w-8 h-8 rounded border"
        />
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          className="w-24"
        />
        <span className="text-sm text-gray-600">{strokeWidth}px</span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-xl w-full"
        style={{ width: '100%', maxWidth: '800px', height: '500px' }}
      />
    </div>
  );
};

export default Whiteboard;