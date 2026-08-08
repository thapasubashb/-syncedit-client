import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    // Switched back to bg-sky-gradient to maintain the seamless color flow across all pages
    <div className="min-h-screen bg-sky-gradient flex flex-col">
      <Navbar />

      <section className="flex-grow flex items-center justify-center px-6 pt-28 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-slate-800 mb-8 bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
            About SyncEdit
          </h1>

          {/* Glass panel using your site's exact aesthetic */}
          <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl">
            <p className="text-slate-700 text-lg leading-relaxed mb-6">
              SyncEdit is a collaborative text editor built from the ground up with <span className="text-cyan-600 font-semibold">CRDTs</span> (Conflict-Free Replicated Data Types) – the next-generation approach to real-time collaboration.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed mb-6">
              Unlike traditional Operational Transformation (OT) systems, SyncEdit requires <span className="text-pink-600 font-semibold">no central server</span> to resolve conflicts. All edits are automatically merged, even when users are offline.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed">
              This project is built with <span className="text-cyan-600 font-semibold">React, TypeScript, Tailwind CSS</span>, and a custom RGA CRDT implementation. WebSocket communication ensures real-time sync with <span className="text-pink-600 font-semibold">sub‑100ms latency</span>.
            </p>

            <div className="mt-8 pt-6 border-t border-white/30">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-3">
                {['React 18', 'TypeScript', 'Tailwind CSS', 'CRDT (RGA)', 'WebSocket', 'Node.js', 'Express'].map((tech) => (
                  <span key={tech} className="px-4 py-2 bg-white/40 backdrop-blur-md rounded-full text-sm text-slate-700 font-medium border border-white/50 shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}