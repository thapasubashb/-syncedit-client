import Navbar from '../components/Navbar';
import SimpleEditor from '../components/SimpleEditor';

export default function Editor() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <Navbar />
      <section className="pt-28 pb-12 px-6 max-w-6xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
          <SimpleEditor clientId={1} />
        </div>
      </section>
    </div>
  );
}