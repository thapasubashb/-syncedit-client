import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    // The parent wrapper has the gradient. 
    // All children sections have transparent backgrounds so the gradient flows seamlessly.
    <div className="min-h-screen w-full bg-sky-gradient flex flex-col">
      <Navbar />

      {/* SLIDE 1: HERO (Transparent bg to allow flow) */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-10 pb-12">
        <div className="max-w-4xl mx-auto text-center text-white drop-shadow-lg">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-5 py-2 text-sm font-medium mb-8 shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            CRDT-powered · Real‑time · Zero conflicts
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 drop-shadow-md text-white">
            SyncEdit
          </h1>

          <p className="text-xl text-white/95 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-sm">
            The next-generation collaborative editor built on CRDTs — no central server,
            no merge conflicts, just seamless teamwork.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/editor" 
              className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-1 hover:scale-105"
            >
              Try the Editor ↓
            </Link>
            <Link 
              to="/features" 
              className="px-8 py-3.5 bg-white/20 backdrop-blur-md border-2 border-white/30 hover:bg-white/30 text-white font-bold rounded-full transition-all hover:-translate-y-1"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* SLIDE 2: WHY SYNCEDIT? (Transparent bg, relies on card glass effects) */}
      <section className="relative bg-transparent py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 drop-shadow-sm">Why SyncEdit?</h2>
            <p className="text-slate-700 mt-3 text-lg font-medium">Fast, resilient, and built for teamwork.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {features.map((f, idx) => (
              <div 
                key={idx} 
                className="bg-white/30 backdrop-blur-lg border border-white/40 rounded-3xl p-10 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center"
              >
                <div className="text-7xl mb-6 bg-white/40 p-4 rounded-2xl backdrop-blur-sm border border-white/50 shadow-inner transition duration-300">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{f.title}</h3>
                <p className="text-slate-700 text-base max-w-xs">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLIDE 3: FOOTER AREA (Transparent bg so it fades perfectly into the gradient) */}
      <section className="relative bg-transparent flex-grow flex flex-col justify-end">
        <Footer />
      </section>
    </div>
  );
}

const features = [
  { icon: '🧠', title: 'CRDT Engine', description: 'Automatic conflict resolution – no lost edits ever.' },
  { icon: '⚡', title: 'Sub‑100ms', description: 'Optimized binary protocol keeps operations instant.' },
  { icon: '📦', title: '85% Smaller Payload', description: 'Custom binary encoding saves bandwidth.' },
  { icon: '🌐', title: 'Offline-Ready', description: 'Edits sync flawlessly when you reconnect.' },
]; 