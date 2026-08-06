import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-orange-100 to-yellow-200">
      <Navbar />
      <section className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">All Features</h1>
        <div className="space-y-6">
          {details.map((d, i) => (
            <div key={i} className="glass rounded-xl p-6 border border-white/30 hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{d.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{d.title}</h3>
                  <p className="text-gray-600">{d.desc}</p>
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