// src/components/Footer.tsx
export default function Footer() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8 px-6 py-12 bg-transparent border-t border-white/20 mt-auto">
      {/* Left Side: Tagline & extra info */}
      <div className="flex-1">
        <p className="text-slate-950 text-base leading-relaxed max-w-sm">
          Next-gen real-time collaboration engine built for zero-conflict teamwork, seamless speed, and resilient offline sync.
        </p>
        <p className="text-slate-800  text-sm mt-2">
          Built with ❤️ using React, TypeScript, and CRDTs.
        </p>
      </div>

      {/* Right Side: Social links – vertical stack */}
      <div className="flex flex-col items-end gap-2">
        <a 
          href="https://github.com/thapasubashb" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-slate-700 hover:text-blue-600 transition flex items-center gap-2 font-medium"
        >
          <span className="text-xl">🐙</span> GitHub - thapasubashb
        </a>
        <a 
          href="https://www.linkedin.com/in/B-Subash" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-slate-700 hover:text-blue-600 transition flex items-center gap-2 font-medium"
        >
          <span className="text-xl">🔗</span> LinkedIn - B SUBASH
        </a>
        <a 
          href="https://www.instagram.com/Subash._.10" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-slate-700 hover:text-pink-500 transition flex items-center gap-2 font-medium"
        >
          <span className="text-xl">📷</span> Instagram - Subash._.10 
        </a>
        <p className="text-xs text-slate-950 mt-2">© 2026 SyncEdit by SUBASH </p>
      </div>
    </div>
  );
}