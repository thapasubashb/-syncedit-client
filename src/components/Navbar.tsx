// src/components/Navbar.tsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-7xl bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl px-4 py-3 shadow-2xl flex items-center justify-between mx-auto transition-all">
      <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
        SyncEdit
      </Link>
      
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-slate-700/90 hover:text-slate-900 transition font-medium relative group">
          Home
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
        </Link>
        <Link to="/features" className="text-slate-700/90 hover:text-slate-900 transition font-medium relative group">
          Features
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
        </Link>
        <Link to="/about" className="text-slate-700/90 hover:text-slate-900 transition font-medium relative group">
          About
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
        </Link>
        <Link to="/editor" className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full font-medium transition shadow-lg hover:shadow-xl hover:scale-105 text-sm">
          Get Started
        </Link>
      </div>
    </nav>
  );
}