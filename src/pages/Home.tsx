import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-shopify-off-white">
      <Navbar />

      {/* HERO SECTION – Dark gradient + floating shapes */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 -z-10 bg-hero-gradient animate-gradient" />

        {/* Floating 3D shapes */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-shopify-blue/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-shopify-purple/10 rounded-full blur-3xl animate-pulse-soft" />

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 text-sm font-medium text-white mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            CRDT-powered · Real-time · Zero conflicts
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
            SyncEdit
          </h1>

          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            The next-generation collaborative editor built on CRDTs — no central server,
            no merge conflicts, just seamless teamwork.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/editor"
              className="px-8 py-3 bg-white text-shopify-purple hover:bg-shopify-off-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Try the Editor ↓
            </Link>
            <Link
              to="/features"
              className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-semibold rounded-full transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION – Shopify-style cards */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-shopify-purple">Why SyncEdit?</h2>
          <p className="text-gray-600 mt-3 text-lg">Built for the modern web – fast, resilient, and beautiful.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="glass-card rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-shopify-lavender/30 hover:border-shopify-blue/50 group"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-shopify-purple group-hover:text-shopify-blue transition">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

const features = [
  { icon: '🧠', title: 'CRDT Engine', description: 'RGA algorithm ensures automatic conflict resolution – no lost edits, ever.' },
  { icon: '⚡', title: 'Sub‑100ms Latency', description: 'Optimized binary protocol and efficient diffing keep operations instant.' },
  { icon: '📦', title: '85% Smaller Payload', description: 'Custom binary encoding slashes bandwidth usage compared to JSON.' },
  { icon: '🌐', title: 'Offline-Ready', description: 'Edits are stored locally and sync seamlessly when you reconnect.' },
];