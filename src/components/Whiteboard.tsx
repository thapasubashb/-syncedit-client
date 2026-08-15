// src/components/Whiteboard.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { ShapeCRDT } from '../crdt/ShapeCRDT';
import { ShapeVertex, ShapeData, ShapeVertexId } from '../crdt/shapeTypes';
import { useWebSocket } from '../context/WebSocketContext';
import { MessageType, BinaryShapeInsert, BinaryShapeUpdate, BinaryShapeDelete } from '../network';

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

  const { clientId: wsClientId, sendBinary, onMessage, isConnected } = useWebSocket();
  const effectiveClientId = wsClientId || clientId;

  // --- Apply a remote shape operation ---
  const renderAllShapes = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    isInternalUpdate.current = true;
    canvas.clear();
    const shapes = shapeCRDT.getOrderedShapes();
    console.log('🔄 Rendering shapes:', shapes.length);
    for (const vertex of shapes) {
      renderShape(canvas, vertex);
    }
    canvas.renderAll();
    isInternalUpdate.current = false;
  }, [shapeCRDT]);

  const applyShapeOperation = useCallback((msg: any) => {
    console.log('📥 Applying shape operation:', msg.type);
    if (msg.type === MessageType.SHAPE_INSERT) {
      const insertMsg = msg as BinaryShapeInsert;
      const vertex = insertMsg.shapeVertex;
      // Insert into local CRDT using the proper method
      const existing = shapeCRDT.getOrderedShapes().find(v => 
        v.id.clientId === vertex.id.clientId && v.id.lamportTime === vertex.id.lamportTime
      );
      if (!existing) {
        shapeCRDT.insertShapeWithId(vertex.shapeData, vertex.parentId, vertex.id);
        onShapeUpdate();
        renderAllShapes();
      }
    } else if (msg.type === MessageType.SHAPE_UPDATE) {
      const updateMsg = msg as BinaryShapeUpdate;
      shapeCRDT.updateShape(updateMsg.vertexId, updateMsg.shapeData);
      onShapeUpdate();
      renderAllShapes();
    } else if (msg.type === MessageType.SHAPE_DELETE) {
      const deleteMsg = msg as BinaryShapeDelete;
      shapeCRDT.deleteShape(deleteMsg.vertexId);
      onShapeUpdate();
      renderAllShapes();
    }
  }, [shapeCRDT, onShapeUpdate, renderAllShapes]);

  // --- Register for binary shape messages ---
  useEffect(() => {
    const handleBinaryMessage = (msg: any) => {
      console.log('📨 Binary message received:', msg.type);
      if (msg.clientId === wsClientId) {
        console.log('⏭️ Skipping own message');
        return;
      }
      if (msg.type === MessageType.SHAPE_INSERT || msg.type === MessageType.SHAPE_UPDATE || msg.type === MessageType.SHAPE_DELETE) {
        applyShapeOperation(msg);
      }
    };
    onMessage('all', handleBinaryMessage);
  }, [onMessage, wsClientId, applyShapeOperation]);

  // --- Helper: fabric object to ShapeData ---
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

  // --- Render a single shape ---
  const renderShape = (canvas: fabric.Canvas, vertex: ShapeVertex) => {
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
          fill: data.fill,
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
  };

  // --- Initialize Fabric canvas ---
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: '#ffffff',
    });
    fabricCanvasRef.current = canvas;

    // Load existing shapes
    renderAllShapes();

    // --- Event: object added ---
    canvas.on('object:added', (e) => {
      if (isInternalUpdate.current) return;
      const obj = e.target;
      if (!obj) return;

      const shapeData = fabricToShapeData(obj);
      if (!shapeData) return;

      const parentId: ShapeVertexId = { clientId: 0, lamportTime: 0 };
      const vertex = shapeCRDT.insertShape(shapeData, parentId);
      onShapeUpdate();

      console.log('🔵 Sending shape insert:', vertex);

      const binaryMsg: BinaryShapeInsert = {
        type: MessageType.SHAPE_INSERT,
        clientId: effectiveClientId,
        lamportTime: vertex.id.lamportTime,
        shapeVertex: vertex,
      };
      sendBinary(binaryMsg);
    });

    // --- Event: object modified ---
    canvas.on('object:modified', (e) => {
      if (isInternalUpdate.current) return;
      const obj = e.target;
      if (!obj) return;

      const vertexId = (obj as any).vertexId;
      if (!vertexId) return;

      const shapeData = fabricToShapeData(obj);
      if (!shapeData) return;

      shapeCRDT.updateShape(vertexId, shapeData);
      onShapeUpdate();

      console.log('🟡 Sending shape update:', vertexId);

      const binaryMsg: BinaryShapeUpdate = {
        type: MessageType.SHAPE_UPDATE,
        clientId: effectiveClientId,
        lamportTime: shapeCRDT.nextLamport(),
        vertexId: vertexId,
        shapeData: shapeData,
      };
      sendBinary(binaryMsg);
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

      console.log('🔴 Sending shape delete:', vertexId);

      const binaryMsg: BinaryShapeDelete = {
        type: MessageType.SHAPE_DELETE,
        clientId: effectiveClientId,
        lamportTime: shapeCRDT.nextLamport(),
        vertexId: vertexId,
      };
      sendBinary(binaryMsg);
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  // --- Add shape via toolbar ---
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
    <div className="w-full flex flex-col gap-4">
      {/* ─── Sleek Tool Options Bar ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setCurrentTool('select')}
            className={`px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-xs ${
              currentTool === 'select' 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🖱️</span> Select
          </button>
          
          <button
            onClick={() => { setCurrentTool('rectangle'); addShape('rectangle'); }}
            className={`px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-xs ${
              currentTool === 'rectangle' 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>⬜</span> Rect
          </button>

          <button
            onClick={() => { setCurrentTool('circle'); addShape('circle'); }}
            className={`px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-xs ${
              currentTool === 'circle' 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>⭕</span> Circle
          </button>

          <button
            onClick={() => { setCurrentTool('line'); addShape('line'); }}
            className={`px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-xs ${
              currentTool === 'line' 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>╱</span> Line
          </button>
        </div>

        {/* Color / Fill / Stroke configurations */}
        <div className="flex items-center gap-4 flex-wrap text-xs font-mono text-slate-700 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Stroke:</span>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-5 h-5 rounded-full bg-transparent border-0 cursor-pointer"
            />
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Fill:</span>
            <input
              type="color"
              value={selectedFill}
              onChange={(e) => setSelectedFill(e.target.value)}
              className="w-5 h-5 rounded-full bg-transparent border-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              className="w-20 accent-blue-600 cursor-pointer"
            />
            <span className="text-slate-900 font-bold">{strokeWidth}px</span>
          </div>
        </div>
      </div>

      {/* Canvas bounding box */}
      <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-sm w-full flex justify-center p-4">
        <canvas
          ref={canvasRef}
          className="rounded-xl border border-slate-100"
          style={{ width: '100%', maxWidth: '1000px', height: '560px' }}
        />
      </div>
    </div>
  );
};

export default Whiteboard;