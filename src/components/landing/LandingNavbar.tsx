// src/components/landing/LandingNavbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LandingNavbarProps {
  onNavClick?: (index: number) => void;
}

export default function LandingNavbar({ onNavClick }: LandingNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuSections = [
    {
      num: '01',
      title: 'Computation & Intelligence',
      subtitle: 'Real-time collaborative editing with zero conflicts.',
      tag: 'COLLABORATION',
    },
    {
      num: '02',
      title: 'Spatial Canvas & Vector Loom',
      subtitle: 'Multi-layer spatial vector design studio and live presence.',
      tag: 'SPATIAL CANVAS',
    },
    {
      num: '03',
      title: 'Distributed CRDT Architecture',
      subtitle: 'Deterministic state replication and peer-to-peer mesh.',
      tag: 'CRDT ENGINE',
    },
    {
      num: '04',
      title: 'Offline Resilience & Sync',
      subtitle: 'Local-first IndexedDB persistence and instant convergence.',
      tag: 'OFFLINE SYNC',
    },
  ];

  return (
    <>
      {/* ─── Floating Top Pill Navbar ─── */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-6xl pointer-events-none">
        <div className="glass-pill-nav rounded-full px-6 py-3 md:px-8 md:py-3.5 flex items-center justify-between pointer-events-auto border border-white/80 shadow-md backdrop-blur-2xl transition-all duration-300">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group select-none"
            onClick={() => onNavClick?.(0)}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_8px_#2563eb]" />
            <span className="font-sans text-base md:text-lg font-bold tracking-tight text-slate-900 uppercase">
              CANVAS<span className="font-light text-slate-600">SYNC</span>
            </span>
          </Link>

          {/* Center Floating Pill Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onNavClick?.(0)}
              className="font-mono text-xs font-semibold tracking-wider text-slate-700 hover:text-blue-600 transition-colors uppercase relative group py-1"
            >
              Explore
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </button>
            <button 
              onClick={() => onNavClick?.(1)}
              className="font-mono text-xs font-semibold tracking-wider text-slate-700 hover:text-blue-600 transition-colors uppercase relative group py-1"
            >
              Canvas
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </button>
            <button 
              onClick={() => onNavClick?.(2)}
              className="font-mono text-xs font-semibold tracking-wider text-slate-700 hover:text-blue-600 transition-colors uppercase relative group py-1"
            >
              CRDT
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </button>
            <button 
              onClick={() => onNavClick?.(3)}
              className="font-mono text-xs font-semibold tracking-wider text-slate-700 hover:text-blue-600 transition-colors uppercase relative group py-1"
            >
              Sync
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </button>
          </nav>

          {/* Right Actions: CTA + Minimal Menu Button */}
          <div className="flex items-center gap-3">
            <Link 
              to="/workspace" 
              className="hidden sm:inline-flex px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-full font-mono text-xs tracking-wider transition-colors shadow-sm"
            >
              WORKSPACE →
            </Link>
            
            {/* Menu Hamburger Button */}
            <button 
              onClick={() => setMenuOpen(true)}
              className="w-9 h-9 rounded-full bg-white/70 hover:bg-white border border-slate-900/15 flex flex-col items-center justify-center gap-1 transition-all shadow-sm active:scale-95"
              aria-label="Open Navigation Menu"
            >
              <span className="w-3.5 h-[1.5px] bg-slate-900 rounded-full" />
              <span className="w-3.5 h-[1.5px] bg-slate-900 rounded-full" />
              <span className="w-3.5 h-[1.5px] bg-slate-900 rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Apple / Linear Grade Fullscreen Glass Navigation Overlay ─── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/50 backdrop-blur-xl animate-fadeIn">
          {/* Backdrop Click to Dismiss */}
          <div 
            className="absolute inset-0"
            onClick={() => setMenuOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-3xl bg-white/95 rounded-3xl p-6 md:p-10 shadow-2xl border border-white/80 overflow-hidden flex flex-col justify-between max-h-[88vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_10px_#2563eb]" />
                <span className="font-sans text-lg font-bold tracking-tight text-slate-900 uppercase">
                  CANVAS<span className="font-light text-slate-500">SYNC NAVIGATION</span>
                </span>
              </div>
              <button 
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors font-mono text-sm active:scale-95"
                aria-label="Close Menu"
              >
                ✕
              </button>
            </div>

            {/* Interactive Section Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-6 overflow-y-auto pr-1">
              {menuSections.map((sec, idx) => (
                <div
                  key={sec.num}
                  onClick={() => {
                    onNavClick?.(idx);
                    setMenuOpen(false);
                  }}
                  className="group p-5 rounded-2xl bg-slate-50/80 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-400/50 transition-all duration-200 cursor-pointer shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-blue-600">
                        {sec.num}
                      </span>
                      <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-semibold">
                        {sec.tag}
                      </span>
                    </div>
                    <h3 className="font-sans text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                      {sec.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-500 leading-relaxed">
                      {sec.subtitle}
                    </p>
                  </div>
                  <div className="mt-3 font-mono text-[11px] font-semibold text-blue-600 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    GO TO SECTION →
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-mono text-xs text-slate-500">
                CRDT Real-Time Collaborative Canvas Studio
              </span>
              <Link 
                to="/workspace" 
                onClick={() => setMenuOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-full font-mono text-xs tracking-wider transition-colors shadow-md text-center"
              >
                OPEN WORKSPACE HUB →
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
