import Navbar from '../components/Navbar';
import SimpleEditor from '../components/SimpleEditor';

export default function Editor() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-orange-100 to-yellow-200">
      <Navbar />
      <section className="pt-28 pb-12 px-6 max-w-6xl mx-auto">
        <div className="glass rounded-2xl p-6 shadow-2xl">
          <SimpleEditor clientId={1} />
        </div>
      </section>
    </div>
  );
}