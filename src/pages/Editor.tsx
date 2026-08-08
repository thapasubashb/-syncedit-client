// src/pages/Editor.tsx
import Navbar from '../components/Navbar';
import SimpleEditor from '../components/SimpleEditor';

export default function Editor() {
  return (
    <div className="min-h-screen bg-sky-gradient">
      <Navbar />
      <section className="pt-28 pb-12 px-6 max-w-6xl mx-auto">
        {/* Glass card background - white with blur */}
        <div className="glass-card rounded-2xl p-6 shadow-2xl bg-white/80 backdrop-blur-lg border border-white/40">
          <SimpleEditor clientId={1} />
        </div>
      </section>
    </div>
  );
}