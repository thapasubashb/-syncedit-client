import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Subtle glow effects */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm font-medium text-cyan-300 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            CRDT-powered · Real‑time · Zero conflicts
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            SyncEdit
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            The next-generation collaborative editor built on CRDTs — no central server,
            no merge conflicts, just seamless teamwork.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/editor" className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition hover:scale-105">
              Try the Editor ↓
            </Link>
            <Link to="/features" className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold rounded-full transition">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Why SyncEdit?</h2>
          <p className="text-gray-400 mt-2 text-lg">Fast, resilient, and beautiful.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition hover:scale-105 hover:border-cyan-500/50">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-white">{f.title}</h3>
              <p className="text-gray-300 text-sm mt-2">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

const features = [
  { icon: '🧠', title: 'CRDT Engine', description: 'Automatic conflict resolution – no lost edits.' },
  { icon: '⚡', title: 'Sub‑100ms', description: 'Optimized binary protocol keeps operations instant.' },
  { icon: '📦', title: '85% Smaller Payload', description: 'Custom binary encoding saves bandwidth.' },
  { icon: '🌐', title: 'Offline-Ready', description: 'Edits sync when you reconnect.' },
];