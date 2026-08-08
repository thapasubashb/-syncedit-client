import Navbar from '../components/Navbar';
import SimpleEditor from '../components/SimpleEditor';

export default function Editor() {
  return (
    <div className="min-h-screen bg-sky-gradient">
      <Navbar />
      <section className="pt-28 pb-12 px-6 max-w-6xl mx-auto">
        <div className="glass-card rounded-2xl p-8 shadow-xl">
          <SimpleEditor clientId={1} />
        </div>
      </section>
    </div>
  );
}