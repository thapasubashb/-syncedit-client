// src/components/landing/SectionCounter.tsx
import React from 'react';

interface SectionCounterProps {
  currentSection: number; // 1-indexed
  totalSections: number;
  onNavigate?: (index: number) => void;
}

export default function SectionCounter({ currentSection, totalSections, onNavigate }: SectionCounterProps) {
  const formatNumber = (num: number) => String(num).padStart(2, '0');

  const handlePrev = () => {
    if (currentSection > 1) {
      onNavigate?.(currentSection - 2);
    }
  };

  const handleNext = () => {
    if (currentSection < totalSections) {
      onNavigate?.(currentSection);
    }
  };

  return (
    <div className="fixed bottom-8 left-6 md:bottom-10 md:left-10 z-40 flex items-center glass-counter-box rounded-sm px-3.5 py-2 border border-slate-900/20 text-slate-900 select-none shadow-sm backdrop-blur-md">
      {/* Number Display */}
      <div className="flex items-baseline gap-1 mr-3">
        <span className="font-mono text-xl md:text-2xl font-bold tracking-tight text-slate-900">
          {formatNumber(currentSection)}
        </span>
        <span className="font-mono text-[10px] font-semibold text-slate-500 tracking-wider">
          / {formatNumber(totalSections)}
        </span>
      </div>

      {/* Up / Down Navigation Controls */}
      <div className="flex flex-col border-l border-slate-900/15 pl-2 gap-0.5">
        <button
          onClick={handlePrev}
          disabled={currentSection <= 1}
          className="p-0.5 hover:text-blue-600 disabled:opacity-25 transition-colors"
          aria-label="Previous Slide"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          disabled={currentSection >= totalSections}
          className="p-0.5 hover:text-blue-600 disabled:opacity-25 transition-colors"
          aria-label="Next Slide"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}


