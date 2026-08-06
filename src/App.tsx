import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SimpleEditor from './components/SimpleEditor';
import './index.css';

function App() {
  const clientId = 1;
  const editorRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const scrollToEditor = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1040] to-[#0a0a1a] text-white overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              SyncEdit
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#editor" className="hover:text-white transition">Editor</a>
            <a href="#" className="hover:text-white transition">Docs</a>
          </div>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-semibold transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section with CSS 3D Shape */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
        {/* CSS 3D Shape */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-96 h-96 relative perspective-1000">
            <div className="absolute inset-0 animate-spin-slow" style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-20 blur-2xl"
                   style={{ transform: 'rotateX(75deg) rotateZ(45deg) translateZ(-50px)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20 blur-2xl"
                   style={{ transform: 'rotateY(75deg) rotateX(45deg) translateZ(50px)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 blur-2xl"
                   style={{ transform: 'rotateZ(75deg) rotateX(-45deg) translateZ(0px)' }}></div>
            </div>
          </div>
        </div>

        <motion.div
          style={{ opacity, scale }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-purple-300 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            CRDT-powered · Real-time · Zero conflicts
          </div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          >
            SyncEdit
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            The next-generation collaborative editor built on CRDTs — no central server, no merge conflicts, just seamless teamwork.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={scrollToEditor}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Try the Editor ↓
            </button>
            <button className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold rounded-full transition-all duration-300">
              Learn More
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section – unchanged */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            Why SyncEdit?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-gray-400 mt-2"
          >
            Built for the modern web – fast, resilient, and beautiful.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Editor Section */}
      <section id="editor" ref={editorRef} className="max-w-5xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl"
        >
          <SimpleEditor clientId={clientId} />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-gray-400 max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">React 18</span>
          <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">TypeScript</span>
          <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Tailwind CSS</span>
          <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">CRDT (RGA)</span>
          <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">WebSocket</span>
        </div>
        <p>© 2026 SyncEdit – Built with ❤️ for the future of collaboration</p>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: '🧠',
    title: 'CRDT Engine',
    description: 'RGA algorithm ensures automatic conflict resolution – no lost edits, ever.',
  },
  {
    icon: '⚡',
    title: 'Sub‑100ms Latency',
    description: 'Optimized binary protocol and efficient diffing keep operations instant.',
  },
  {
    icon: '📦',
    title: '85% Smaller Payload',
    description: 'Custom binary encoding slashes bandwidth usage compared to JSON.',
  },
  {
    icon: '🌐',
    title: 'Offline-Ready',
    description: 'Edits are stored locally and sync seamlessly when you reconnect.',
  },
];

export default App;