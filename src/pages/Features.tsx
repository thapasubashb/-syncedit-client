import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Features() {
  return (
    <div className="min-h-screen bg-shopify-off-white">
      <Navbar />
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-shopify-purple mb-4">
            Everything You Need for Real-Time Collaboration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            SyncEdit combines cutting-edge CRDT technology with a beautiful interface
            to deliver the best collaborative editing experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {detailedFeatures.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl p-8 hover:shadow-2xl transition-all border border-shopify-lavender/30 hover:border-shopify-blue/50"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{f.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-shopify-purple mb-2">{f.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{f.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

const detailedFeatures = [
  { icon: '⚡', title: 'Blazing Fast Performance', description: 'Sub-100ms operation latency even with 50+ concurrent users.' },
  { icon: '🔀', title: 'Automatic Conflict Resolution', description: 'The RGA CRDT algorithm handles all merge conflicts automatically.' },
  { icon: '📡', title: 'Bandwidth Efficient', description: '85% smaller payloads compared to JSON-based protocols.' },
  { icon: '💾', title: 'Offline-First Architecture', description: 'Edits are stored locally and sync automatically when you reconnect.' },
  { icon: '🔄', title: 'Real-Time Sync', description: 'Changes appear instantly on all connected devices with WebSocket.' },
  { icon: '📊', title: 'Rich Analytics', description: 'Track document history, view edit patterns, and understand collaboration dynamics.' },
];