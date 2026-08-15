// src/pages/Editor.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SimpleEditor from '../components/SimpleEditor';
import Whiteboard from '../components/Whiteboard';
import { ShapeCRDT } from '../crdt/ShapeCRDT';
import { useWebSocket } from '../context/WebSocketContext';

export default function Editor() {
  const { clientId } = useWebSocket();
  const location = useLocation();
  const [shapeCRDT] = useState(() => new ShapeCRDT(clientId || 1));
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  // Set initial mode from route navigation state if available
  useEffect(() => {
    if (location.state?.mode === 'whiteboard') {
      setShowWhiteboard(true);
    } else if (location.state?.mode === 'text') {
      setShowWhiteboard(false);
    }
  }, [location.state]);

  return (
    <div 
      style={{ background: 'linear-gradient(135deg, #93c5fd 0%, #bfdbfe 30%, #e0e7ff 65%, #f8fafc 100%)' }}
      className="min-h-screen text-slate-900 relative overflow-hidden flex flex-col"
    >
      {/* Navbar wrapper */}
      <Navbar />

      <main className="flex-grow pt-28 pb-16 px-6 max-w-7xl mx-auto w-full relative z-10 flex flex-col">
        {/* Workspace Switcher Tab */}
        <div className="flex items-center gap-2 glass-pill-nav p-1.5 rounded-full w-fit mb-6 shadow-sm border border-white/70">
          <button
            onClick={() => setShowWhiteboard(false)}
            className={`px-6 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-300 flex items-center gap-2 ${
              !showWhiteboard 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Text Editor
          </button>
          
          <button
            onClick={() => setShowWhiteboard(true)}
            className={`px-6 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-300 flex items-center gap-2 ${
              showWhiteboard 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Whiteboard
          </button>
        </div>

        {/* Panel View Area */}
        <div className="flex-grow w-full flex flex-col justify-start">
          {!showWhiteboard ? (
            <div className="glass-luminous rounded-3xl p-6 shadow-sm border border-white/80 flex flex-col w-full">
              <SimpleEditor clientId={clientId || 1} />
            </div>
          ) : (
            <div className="glass-luminous rounded-3xl p-6 shadow-sm border border-white/80 flex flex-col w-full overflow-hidden">
              <Whiteboard
                clientId={clientId || 1}
                shapeCRDT={shapeCRDT}
                onShapeUpdate={() => console.log('Shapes updated')}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}