import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SimpleEditor from '../components/SimpleEditor';
import Whiteboard from '../components/Whiteboard';
import { ShapeCRDT } from '../crdt/ShapeCRDT';
import { useWebSocket } from '../context/WebSocketContext';

export default function Editor() {
  const { clientId } = useWebSocket();
  const [shapeCRDT] = useState(() => new ShapeCRDT(clientId || 1));
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  return (
    <div className="min-h-screen bg-sky-gradient">
      <Navbar />
      <section className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setShowWhiteboard(false)}
            className={`px-4 py-2 rounded ${!showWhiteboard ? 'bg-blue-500 text-white' : 'bg-white/30'}`}
          >
            📝 Text Editor
          </button>
          <button
            onClick={() => setShowWhiteboard(true)}
            className={`px-4 py-2 rounded ${showWhiteboard ? 'bg-blue-500 text-white' : 'bg-white/30'}`}
          >
            🎨 Whiteboard
          </button>
        </div>

        {!showWhiteboard ? (
          <div className="glass-card rounded-2xl p-6 shadow-2xl">
            <SimpleEditor clientId={clientId || 1} />
          </div>
        ) : (
          <Whiteboard
            clientId={clientId || 1}
            shapeCRDT={shapeCRDT}
            onShapeUpdate={() => console.log('Shapes updated')}
          />
        )}
      </section>
    </div>
  );
}