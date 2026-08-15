// src/components/Navbar.tsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-7xl">
      <nav className="glass-pill-nav rounded-full px-6 py-3 md:px-8 md:py-3.5 shadow-md flex items-center justify-between mx-auto border border-white/80 backdrop-blur-2xl transition-all duration-300">
        
        {/* Brand Logo with Glowing Bead */}
        <Link to="/" className="flex items-center gap-2.5 group select-none">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_8px_#2563eb]" />
          <span className="font-sans text-base font-bold tracking-tight text-slate-900 uppercase">
            CANVAS<span className="font-light text-slate-600">SYNC</span>
          </span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link 
            to="/" 
            className="text-xs font-mono font-medium tracking-wider text-slate-700 hover:text-blue-600 transition-colors uppercase"
          >
            Home
          </Link>
          <Link 
            to="/workspace" 
            className="text-xs font-mono font-medium tracking-wider text-slate-700 hover:text-blue-600 transition-colors uppercase"
          >
            Hub
          </Link>
          <Link 
            to="/workspace" 
            className="px-5 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-full font-mono text-xs tracking-wider transition-colors shadow-sm"
          >
            WORKSPACE →
          </Link>
        </div>
      </nav>
    </header>
  );
}