import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl px-6 py-4 shadow-2xl flex items-center justify-between mx-auto transition-all">
      <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
        SyncEdit
      </Link>
      
      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="text-slate-700/90 hover:text-slate-900 transition font-medium">Home</Link>
        <Link to="/features" className="text-slate-700/90 hover:text-slate-900 transition font-medium">Features</Link>
        {/* Added new About Link here */}
        <Link to="/about" className="text-slate-700/90 hover:text-slate-900 transition font-medium">About</Link>
        <Link to="/editor" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full font-medium transition shadow-lg hover:shadow-xl hover:scale-105">
          Get Started
        </Link>
      </div>
    </nav>
  );
}