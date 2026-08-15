// src/components/Footer.tsx
export default function Footer() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8 px-6 py-12 bg-transparent border-t border-white/10 mt-auto">
      {/* Left Side: Tagline & extra info */}
      <div className="flex-1">
        <p className="text-white/80 text-sm leading-relaxed max-w-sm">
          Next-gen real-time collaboration engine built for zero-conflict teamwork, seamless speed, and resilient offline sync.
        </p>
        <p className="text-white/50 text-xs mt-2 font-mono">
          Built with ❤️ using React, TypeScript, and CRDTs.
        </p>
      </div>

      {/* Right Side: Social links – vertical stack */}
      <div className="flex flex-col items-end gap-2 text-xs font-mono">
        <a 
          href="https://github.com/thapasubashb" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-white/60 hover:text-cs-blue transition flex items-center gap-2"
        >
          <span>🐙</span> GitHub - thapasubashb
        </a>
        <a 
          href="https://www.linkedin.com/in/B-Subash" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-white/60 hover:text-cs-blue transition flex items-center gap-2"
        >
          <span>🔗</span> LinkedIn - B SUBASH
        </a>
        <a 
          href="https://www.instagram.com/Subash._.10" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-white/60 hover:text-cs-pink transition flex items-center gap-2"
        >
          <span>📷</span> Instagram - Subash._.10 
        </a>
        <p className="text-xs text-white/30 mt-2">© 2026 CanvasSync by SUBASH </p>
      </div>
    </div>
  );
}