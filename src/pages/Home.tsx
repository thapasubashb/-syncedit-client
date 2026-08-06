import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-orange-100 to-yellow-200">
      <Navbar />

      {/* Hero with vivid gradient */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNGgtMnYyaDJ2LTJ6bTQgMGgtMnYyaDJ2LTJ6bTAgNGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            CRDT-powered · Real‑time · Zero conflicts
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 drop-shadow-lg">
            SyncEdit
          </h1>

          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            The next-generation collaborative editor built on CRDTs — no central server,
            no merge conflicts, just seamless teamwork.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/editor" className="px-8 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-xl hover:shadow-2xl transition hover:scale-105">
              Try the Editor ↓
            </Link>
            <Link to="/features" className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-semibold rounded-full transition">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features – bright cards */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Why SyncEdit?</h2>
          <p className="text-gray-600 mt-2 text-lg">Fast, resilient, and beautiful.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="glass rounded-2xl p-8 hover:shadow-2xl transition hover:scale-105">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-800">{f.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{f.description}</p>
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