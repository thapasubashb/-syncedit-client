import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <Navbar />
      <section className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-12 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
          All Features
        </h1>
        <div className="space-y-6">
          {details.map((d, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl hover:shadow-2xl transition hover:border-cyan-500/30">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{d.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold text-white">{d.title}</h3>
                  <p className="text-gray-300">{d.desc}</p>
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