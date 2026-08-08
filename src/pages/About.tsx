import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <Navbar />

      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
          About SyncEdit
        </h1>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl">
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            SyncEdit is a collaborative text editor built from the ground up with <span className="text-cyan-400 font-semibold">CRDTs</span> (Conflict-Free Replicated Data Types) – the next-generation approach to real-time collaboration.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Unlike traditional Operational Transformation (OT) systems, SyncEdit requires <span className="text-pink-400 font-semibold">no central server</span> to resolve conflicts. All edits are automatically merged, even when users are offline.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            This project is built with <span className="text-cyan-400 font-semibold">React, TypeScript, Tailwind CSS</span>, and a custom RGA CRDT implementation. WebSocket communication ensures real-time sync with <span className="text-pink-400 font-semibold">sub‑100ms latency</span>.
          </p>

          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-3">
              {['React 18', 'TypeScript', 'Tailwind CSS', 'CRDT (RGA)', 'WebSocket', 'Node.js', 'Express'].map((tech) => (
                <span key={tech} className="px-4 py-2 bg-white/5 rounded-full text-sm text-gray-300 border border-white/10">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}