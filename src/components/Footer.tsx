export default function Footer() {
  return (
    <div className="w-full flex flex-col items-center justify-center pb-12 px-6 pt-8">
      {/* Tagline - 15 Words exactly */}
      <p className="text-slate-700 text-lg font-medium mb-8 bg-white/30 backdrop-blur-md inline-block px-6 py-3 rounded-full shadow-lg border border-white/40 transition hover:bg-white/40">
        Next-gen real-time collaboration engine built for zero-conflict teamwork, seamless speed, and resilient offline sync.
      </p>

      {/* Social Links */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <a href="https://github.com/thapasubashb" target="_blank" rel="noopener noreferrer" 
           className="flex items-center gap-2 bg-white/30 backdrop-blur-md px-5 py-3 rounded-full hover:bg-white/60 hover:-translate-y-1 transition shadow-lg border border-white/40 text-slate-800 font-medium">
          <span className="text-xl">🐙</span> GitHub
        </a>
        <a href="https://www.linkedin.com/in/B-Subash" target="_blank" rel="noopener noreferrer" 
           className="flex items-center gap-2 bg-white/30 backdrop-blur-md px-5 py-3 rounded-full hover:bg-white/60 hover:-translate-y-1 transition shadow-lg border border-white/40 text-slate-800 font-medium">
          <span className="text-xl">🔗</span> B . Subash
        </a>
        <a href="https://www.instagram.com/Subash._.10" target="_blank" rel="noopener noreferrer" 
           className="flex items-center gap-2 bg-white/30 backdrop-blur-md px-5 py-3 rounded-full hover:bg-white/60 hover:-translate-y-1 transition shadow-lg border border-white/40 text-slate-800 font-medium">
          <span className="text-xl">📷</span> Subash._.10
        </a>
      </div>

      <p className="text-slate-600 text-sm font-medium bg-white/20 backdrop-blur-sm inline-block px-6 py-2 rounded-full border border-white/30 shadow-sm">
        © 2026 SyncEdit – Built with ❤️
      </p>
    </div>
  );
}