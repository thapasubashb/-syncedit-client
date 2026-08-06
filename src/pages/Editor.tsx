import Navbar from '../components/Navbar';
import SimpleEditor from '../components/SimpleEditor';

export default function Editor() {
  const clientId = 1;
  return (
    <div className="min-h-screen bg-shopify-off-white">
      <Navbar />
      <section className="pt-28 pb-12 px-6 max-w-6xl mx-auto">
        <div className="glass-card rounded-2xl p-6">
          <SimpleEditor clientId={clientId} />
        </div>
      </section>
    </div>
  );
}