export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {['React 18', 'TypeScript', 'Tailwind CSS', 'CRDT', 'WebSocket'].map((tech) => (
            <span key={tech} className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-sm text-gray-300 font-medium border border-white/10">
              {tech}
            </span>
          ))}
        </div>
        <p className="text-center text-gray-400 text-sm">© 2026 SyncEdit – Built with ❤️</p>
      </div>
    </footer>
  );
}