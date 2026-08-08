import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Features() {
  return (
    <div className="min-h-screen bg-sky-gradient">
      <Navbar />
      <section className="pt-32 pb-20 px-6 max-w-5xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-12 drop-shadow-sm">All Features</h1>
        <div className="space-y-6">
          {details.map((d, i) => (
            <div key={i} className="glass-card rounded-xl p-8 hover:scale-[1.01] transition duration-300">
              <div className="flex items-start gap-5">
                <span className="text-4xl bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30">{d.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{d.title}</h3>
                  <p className="text-slate-700 mt-1">{d.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

const details = [
  { icon: '⚡', title: 'Blazing Fast', desc: 'Sub-100ms latency with 50+ users.' },
  { icon: '🔀', title: 'Auto Merge', desc: 'No conflicts – RGA CRDT handles everything.' },
  { icon: '📡', title: 'Bandwidth Efficient', desc: '85% smaller than JSON.' },
  { icon: '💾', title: 'Offline-First', desc: 'Edits store locally and sync later.' },
  { icon: '🔄', title: 'Real-Time Sync', desc: 'WebSocket updates instantly.' },
  { icon: '📊', title: 'Analytics', desc: 'Track history and edit patterns.' },
];