import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-shopify-lavender/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-shopify-purple tracking-tight">
          SyncEdit
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-shopify-purple transition font-medium">Home</Link>
          <Link to="/features" className="text-gray-600 hover:text-shopify-purple transition font-medium">Features</Link>
          <Link to="/editor" className="px-6 py-2 bg-shopify-purple hover:bg-shopify-blue text-white rounded-full font-medium transition shadow-lg hover:shadow-xl">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}