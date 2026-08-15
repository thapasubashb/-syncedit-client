// src/pages/Workspace.tsx
import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Luminous Ambient Particle Field ───
function LuminousParticles({ count = 80 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#3b82f6'),
      new THREE.Color('#8b5cf6'),
      new THREE.Color('#ec4899'),
      new THREE.Color('#06b6d4'),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;

      const c = palette[i % palette.length];
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    return [pos, cols];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

export default function Workspace() {
  const navigate = useNavigate();

  return (
    <div 
      style={{ background: 'linear-gradient(135deg, #93c5fd 0%, #bfdbfe 30%, #e0e7ff 65%, #f8fafc 100%)' }}
      className="min-h-screen w-full text-slate-900 relative overflow-hidden flex flex-col justify-between"
    >
      {/* ─── Ambient WebGL Particles Backdrop ─── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Canvas camera={{ position: [0, 0, 3.5], fov: 60 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.8} />
          <LuminousParticles />
        </Canvas>
      </div>

      {/* Floating Header */}
      <header className="w-full px-8 py-6 md:px-12 md:py-8 flex items-center justify-between z-50 relative">
        <Link to="/" className="flex flex-col items-start group select-none">
          <span className="font-sans text-lg md:text-xl font-bold tracking-tight text-slate-900 uppercase leading-none">
            CANVAS
          </span>
          <span className="font-sans text-lg md:text-xl font-bold tracking-tight text-slate-900 uppercase leading-none">
            SYNC
          </span>
        </Link>
        
        <Link 
          to="/" 
          className="px-5 py-2 glass-pill-nav hover:bg-white text-slate-900 rounded-full font-mono text-xs tracking-wider transition border border-slate-900/10 shadow-sm"
        >
          ← BACK HOME
        </Link>
      </header>

      {/* Workspace Selection Main Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 relative z-10 max-w-5xl mx-auto w-full">
        <div className="text-center mb-14">
          <span className="text-eyebrow-luminous mb-3 block">
            CHOOSE YOUR SPACE
          </span>
          <h1 className="text-display-luminous text-4xl md:text-5xl font-light tracking-tight text-slate-900 mb-4 uppercase">
            Workspace Hub
          </h1>
          <p className="text-body-luminous max-w-md mx-auto text-base text-slate-700 leading-relaxed">
            Select a collaborative room tool to start writing, drawing, and syncing ideas in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* Card 1: Text Editor */}
          <div 
            onClick={() => navigate('/editor', { state: { mode: 'text' } })}
            className="card-luminous group flex flex-col justify-between min-h-[340px] p-8 rounded-3xl cursor-pointer relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-headline-luminous text-2xl font-normal text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                TEXT EDITOR
              </h2>
              <p className="text-body-luminous text-sm text-slate-600 leading-relaxed">
                Create structured document rooms, write content with logical ordering, view active peer cursors, and sync offline edits seamlessly.
              </p>
            </div>

            <div className="font-mono text-xs text-blue-600 font-bold tracking-wider mt-6 flex items-center gap-2 relative z-10">
              OPEN EDITOR <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </div>
          </div>

          {/* Card 2: Whiteboard */}
          <div 
            onClick={() => navigate('/editor', { state: { mode: 'whiteboard' } })}
            className="card-luminous group flex flex-col justify-between min-h-[340px] p-8 rounded-3xl cursor-pointer relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-headline-luminous text-2xl font-normal text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                WHITEBOARD
              </h2>
              <p className="text-body-luminous text-sm text-slate-600 leading-relaxed">
                Draw, design, add shapes (rectangles, circles, lines) on a shared vector canvas layout with real-time replication.
              </p>
            </div>

            <div className="font-mono text-xs text-teal-600 font-bold tracking-wider mt-6 flex items-center gap-2 relative z-10">
              OPEN WHITEBOARD <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-xs text-slate-500 font-mono relative z-10">
        © 2026 CanvasSync · Peer-to-Peer CRDT Studio
      </footer>
    </div>
  );
}


