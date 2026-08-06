export default function Footer() {
  return (
    <footer className="border-t border-shopify-lavender/30 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {['React 18', 'TypeScript', 'Tailwind CSS', 'CRDT (RGA)', 'WebSocket'].map((tech) => (
            <span key={tech} className="px-4 py-2 bg-shopify-off-white rounded-full text-sm text-shopify-purple font-medium border border-shopify-lavender/20">
              {tech}
            </span>
          ))}
        </div>
        <p className="text-center text-gray-500 text-sm">© 2026 SyncEdit – Built with ❤️ for the future of collaboration</p>
      </div>
    </footer>
  );
}