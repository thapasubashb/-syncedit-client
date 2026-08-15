// src/components/landing/LandingFooter.tsx
import React from 'react';

export default function LandingFooter() {
  return (
    <footer className="w-full pt-16 pb-28 px-8 md:px-20 relative z-10 text-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
        
        {/* Left Column: CanvasSync Brand & Mission (with left padding to clear the section counter) */}
        <div className="col-span-12 md:col-span-5 pl-0 md:pl-16 flex flex-col justify-between">
          <div>
            <div className="flex flex-col items-start mb-3 select-none">
              <span className="font-sans text-xl font-bold tracking-tight text-slate-900 uppercase leading-none">
                CANVAS
              </span>
              <span className="font-sans text-xl font-bold tracking-tight text-slate-900 uppercase leading-none">
                SYNC
              </span>
            </div>
            <p className="max-w-sm mb-6 text-sm text-slate-700 leading-relaxed font-sans">
              CRDT-Powered Real-Time Collaborative Design Studio. Built for instant state synchronization, offline resilience, and zero-conflict multi-user editing.
            </p>
          </div>
          <p className="font-mono text-xs text-slate-500">
            © 2026 CanvasSync. All rights reserved.
          </p>
        </div>

        {/* Middle Column: Technology Stack */}
        <div className="col-span-12 md:col-span-4">
          <h4 className="font-mono text-xs font-semibold tracking-widest text-slate-500 mb-4 uppercase">
            Technology
          </h4>
          <div className="flex flex-wrap gap-2 font-mono text-xs text-slate-800">
            {['React', 'TypeScript', 'CRDTs', 'WebRTC', 'WebSocket', 'IndexedDB', 'Fabric.js', 'Three.js'].map((tech) => (
              <span 
                key={tech}
                className="px-3 py-1.5 rounded-full bg-white/60 border border-slate-900/10 shadow-sm backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Created by Subash & Social Links */}
        <div className="col-span-12 md:col-span-3 flex flex-col justify-between md:items-end">
          <div className="md:text-right mb-4">
            <h4 className="font-mono text-xs font-semibold tracking-widest text-slate-500 mb-2 uppercase">
              Created By
            </h4>
            <span className="font-sans text-base text-slate-900 font-bold block">
              Subash
            </span>
          </div>
          
          <div className="flex flex-col gap-2.5 md:items-end font-mono text-xs text-slate-700">
            <a 
              href="https://github.com/thapasubashb" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-600 transition-colors flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 text-slate-700 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub — thapasubashb
            </a>
            <a 
              href="https://www.linkedin.com/in/B-Subash" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-600 transition-colors flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 text-slate-700 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn — B SUBASH
            </a>
            <a 
              href="https://www.instagram.com/Subash._.10" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-pink-600 transition-colors flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 text-slate-700 group-hover:text-pink-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram — Subash._.10
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}



