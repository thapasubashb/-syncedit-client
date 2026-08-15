// src/pages/Home.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LandingNavbar from '../components/landing/LandingNavbar';
import SectionCounter from '../components/landing/SectionCounter';
import LandingFooter from '../components/landing/LandingFooter';
import ContinuousScene from '../components/landing/ContinuousScene';

export default function Home() {
  const [activeSection, setActiveSection] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const location = useLocation();
  
  // Section refs for scroll actions
  const sec1Ref = useRef<HTMLDivElement>(null);
  const sec2Ref = useRef<HTMLDivElement>(null);
  const sec3Ref = useRef<HTMLDivElement>(null);
  const sec4Ref = useRef<HTMLDivElement>(null);

  // Frame-by-frame continuous scroll monitor
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const height = target.clientHeight;
    
    // Continuous fraction (0.0 to 3.0+)
    const progress = Math.max(0, scrollTop / height);
    scrollProgressRef.current = progress;
    setScrollProgress(progress);

    // Active section calculation
    const sectionIndex = Math.min(Math.max(Math.round(progress) + 1, 1), 4);
    setActiveSection(sectionIndex);
  }, []);

  // Smooth scroll to section handler
  const scrollToSection = (sectionIndex: number) => {
    const sections = [sec1Ref, sec2Ref, sec3Ref, sec4Ref];
    
    if (sectionIndex >= 4) {
      const footerElement = document.querySelector('footer');
      footerElement?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const targetRef = sections[sectionIndex];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Listen to incoming redirect scroll request states
  useEffect(() => {
    if (location.state?.scrollToSection !== undefined) {
      const target = location.state.scrollToSection;
      setTimeout(() => {
        scrollToSection(target);
      }, 300);
    }
  }, [location.state]);

  // ─── Continuous Easing Calculations for 4 Background Layers ───
  const clamped = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const p = scrollProgress;
  const op1 = clamped(1 - p, 0, 1);
  const op2 = clamped(1 - Math.abs(p - 1), 0, 1);
  const op3 = clamped(1 - Math.abs(p - 2), 0, 1);
  const op4 = clamped(p >= 2 ? p - 2 : 0, 0, 1);

  return (
    <div 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="h-screen overflow-y-auto scroll-smooth snap-y snap-mandatory text-slate-900 relative selection:bg-slate-900 selection:text-white"
    >
      {/* ─── 4-Layer Continuous Real-Time Gradient Cross-Fade Backdrop ─── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Layer 1: Slide 1 Gradient */}
        <div 
          className="absolute inset-0 w-full h-full transition-opacity duration-300 ease-out"
          style={{
            background: 'linear-gradient(135deg, #7e9af7 0%, #a5b4fc 25%, #c4b5fd 50%, #93c5fd 75%, #bfdbfe 100%)',
            opacity: op1,
          }}
        />

        {/* Layer 2: Slide 2 Gradient */}
        <div 
          className="absolute inset-0 w-full h-full transition-opacity duration-300 ease-out"
          style={{
            background: 'linear-gradient(135deg, #93c5fd 0%, #bfdbfe 30%, #e0e7ff 65%, #f8fafc 100%)',
            opacity: op2,
          }}
        />

        {/* Layer 3: Slide 3 Gradient */}
        <div 
          className="absolute inset-0 w-full h-full transition-opacity duration-300 ease-out"
          style={{
            background: 'linear-gradient(135deg, #2dd4bf 0%, #5eead4 30%, #38bdf8 65%, #e0f2fe 100%)',
            opacity: op3,
          }}
        />

        {/* Layer 4: Slide 4 Gradient */}
        <div 
          className="absolute inset-0 w-full h-full transition-opacity duration-300 ease-out"
          style={{
            background: 'linear-gradient(135deg, #f472b6 0%, #e879f9 30%, #c084fc 65%, #fde047 100%)',
            opacity: op4,
          }}
        />

        {/* Ambient atmospheric breathing glow spots */}
        <div className="absolute top-[10%] right-[15%] w-[45vw] h-[45vw] bg-white/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[10%] left-[10%] w-[40vw] h-[40vw] bg-white/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      </div>

      {/* Floating Global Minimal Navbar */}
      <LandingNavbar onNavClick={scrollToSection} />

      {/* Floating Boxed Section Counter with interactive Chevrons */}
      <SectionCounter currentSection={activeSection} totalSections={4} onNavigate={scrollToSection} />

      {/* ─── Master Continuous 3D WebGL Orb Canvas ─── */}
      <ContinuousScene scrollProgressRef={scrollProgressRef} />

      {/* ─── SLIDE 1: COMPUTATION & COLLABORATION (Filament Orb on Right) ─── */}
      <section 
        ref={sec1Ref}
        className="h-screen snap-start snap-always flex items-center px-8 md:px-[9vw] relative z-20 overflow-hidden"
      >
        <div className="max-w-xl md:max-w-2xl flex flex-col items-start pt-12">
          <span className="text-eyebrow-luminous mb-4 block">
            01 — COMPUTATION & INTELLIGENCE
          </span>
          
          <h1 className="text-display-luminous font-light mb-4 uppercase">
            COLLABORATE<br />WITHOUT CONFLICT.
          </h1>
          
          <p className="text-body-luminous text-lg md:text-xl mb-10 max-w-lg font-normal leading-relaxed">
            What if we could exponentially grow collaborative creation and make conflict-free real-time state accessible to all?
          </p>
          
          {/* ONLY ONE PRIMARY CTA ON LANDING PAGE */}
          <Link to="/workspace" className="cta-button-luminous">
            <span>ENTER CANVASSYNC →</span>
          </Link>
        </div>
      </section>

      {/* ─── SLIDE 2: SPATIAL CANVAS & ARCHITECTURE (Architectural Orb on Left, Text on Right) ─── */}
      <section 
        ref={sec2Ref}
        className="h-screen snap-start snap-always flex items-center justify-end px-8 md:px-[9vw] relative z-20 overflow-hidden"
      >
        <div className="max-w-xl md:max-w-2xl flex flex-col items-start text-left">
          <span className="text-eyebrow-luminous mb-4 block">
            02 — ENGINEERING & SPATIAL CANVAS
          </span>

          <h2 className="text-display-luminous font-light mb-5 uppercase">
            CREATE TOGETHER.
          </h2>

          <p className="text-body-luminous text-lg md:text-xl mb-8 max-w-lg font-normal leading-relaxed">
            From engineering our way through spatial design challenges to building resilient, conflict-free collaborative documents, we build solutions for hypermodern teams.
          </p>

          <div className="flex items-center gap-3 font-mono text-xs text-slate-700">
            <span className="px-3.5 py-1.5 rounded-full bg-white/60 border border-slate-900/10 shadow-sm">Multiplayer Presence</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/60 border border-slate-900/10 shadow-sm">Spatial Vector Canvas</span>
          </div>
        </div>
      </section>

      {/* ─── SLIDE 3: DISTRIBUTED CRDT & P2P (Hexagonal Iris Orb on Right, Text on Left) ─── */}
      <section 
        ref={sec3Ref}
        className="h-screen snap-start snap-always flex items-center px-8 md:px-[9vw] relative z-20 overflow-hidden"
      >
        <div className="max-w-xl md:max-w-2xl flex flex-col items-start">
          <span className="text-eyebrow-luminous mb-4 block">
            03 — DISTRIBUTED ARCHITECTURE & CRDT
          </span>

          <h2 className="text-display-luminous font-light mb-5 uppercase">
            ONE STATE.<br />EVERYWHERE.
          </h2>

          <p className="text-body-luminous text-lg md:text-xl mb-8 max-w-lg font-normal leading-relaxed">
            What if we could program conflict-free replicated data types and peer-to-peer WebRTC meshes to become the foundation for instant shared state?
          </p>
          
          <div className="grid grid-cols-2 gap-4 max-w-md font-mono text-xs text-slate-800">
            <div className="bg-white/50 border border-slate-900/10 p-3.5 rounded-xl backdrop-blur-md shadow-sm">
              <span className="text-blue-700 font-bold block mb-0.5">RGA CRDT</span>
              Zero-conflict convergence
            </div>
            <div className="bg-white/50 border border-slate-900/10 p-3.5 rounded-xl backdrop-blur-md shadow-sm">
              <span className="text-emerald-700 font-bold block mb-0.5">Lamport Clocks</span>
              Deterministic ordering
            </div>
          </div>
        </div>
      </section>

      {/* ─── SLIDE 4: OFFLINE RESILIENCE & CONSTELLATION (Constellation Orb on Left, Text on Right) ─── */}
      <section 
        ref={sec4Ref}
        className="h-screen snap-start snap-always flex items-center justify-end px-8 md:px-[9vw] relative z-20 overflow-hidden"
      >
        <div className="max-w-xl md:max-w-2xl flex flex-col items-start text-left">
          <span className="text-eyebrow-luminous mb-4 block">
            04 — OFFLINE RESILIENCE & SYNC
          </span>

          <h2 className="text-display-luminous font-light mb-5 uppercase">
            ALWAYS IN SYNC.
          </h2>

          <p className="text-body-luminous text-lg md:text-xl mb-8 max-w-lg font-normal leading-relaxed">
            The way we orchestrate and synchronize ideas must level-up in order to accommodate faster, tech-enabled creation. Work offline, recover, and merge state seamlessly.
          </p>

          <div className="flex flex-wrap gap-2.5 font-mono text-xs text-slate-800">
            <span className="px-3.5 py-1.5 rounded-full bg-white/60 border border-slate-900/10 shadow-sm">✓ IndexedDB Local Store</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/60 border border-slate-900/10 shadow-sm">✓ P2P WebRTC Fallback</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/60 border border-slate-900/10 shadow-sm">✓ Reconnection Merge</span>
          </div>
        </div>
      </section>

      {/* ─── FOOTER (Seamless Final Scene) ─── */}
      <div className="snap-start relative z-30">
        <LandingFooter />
      </div>
    </div>
  );
}