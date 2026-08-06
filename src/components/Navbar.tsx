import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Left */}
          <Link 
            to="/" 
            className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent"
          >
            SyncEdit
          </Link>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-400 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link 
              to="/features" 
              className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-400 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link 
              to="/editor" 
              className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
            >
              Editor
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-400 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>

          {/* Right Side - Get Started Button */}
          <div className="flex items-center gap-4">
            <Link 
              to="/editor" 
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white text-sm font-medium rounded-full transition shadow-lg hover:shadow-cyan-500/30"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white hover:text-cyan-400 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}