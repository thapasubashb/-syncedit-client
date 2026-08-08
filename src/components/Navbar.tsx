import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-md border-b border-white/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          SyncEdit
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-slate-800/80 hover:text-slate-900 transition font-medium">Home</Link>
          <Link to="/features" className="text-slate-800/80 hover:text-slate-900 transition font-medium">Features</Link>
          <Link to="/editor" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full font-medium transition shadow-md hover:shadow-xl">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}