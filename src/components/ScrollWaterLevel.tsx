import React, { useState, useEffect } from 'react';
import { Waves, Droplet, AlertCircle } from 'lucide-react';

export const ScrollWaterLevel: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollPercent(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial load calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Map scroll percent (0-100) to water depth (0 to 6 feet)
  const simulatedDepthFt = +(scrollPercent * 0.08).toFixed(1);

  // Get warning text based on water height
  const getFloodWarning = (depth: number) => {
    if (depth === 0) return '🟢 Dry: Sidewalks walkable. Captains drinking tea.';
    if (depth < 2) return '🟡 Ankle Deep: Submerged flip-flops. Low-ride canoes active.';
    if (depth < 4.5) return '🟠 Knee Deep: Auto-rickshaws stranded. Active paddling recommended!';
    return '🔴 Neck Deep: Roads are waterparks. SOS Mode highly advised!';
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 pointer-events-none pb-4">
      
      {/* Scroll Warning floating badge */}
      <div className="mx-auto max-w-7xl px-4 flex justify-center sm:justify-start">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/95 px-4 py-2 text-[10px] font-black text-white shadow-xl shadow-blue-500/20 border border-blue-500/30 backdrop-blur-md pointer-events-auto transition-all hover:scale-105">
          <Droplet className="h-3.5 w-3.5 text-cyan-200 animate-bounce" />
          <span className="font-mono uppercase tracking-wider">
            Scroll Flood Gauge: <span className="text-cyan-200">{simulatedDepthFt} feet</span>
          </span>
          <span className="h-3.5 w-px bg-blue-400/50"></span>
          <span className="line-clamp-1 font-sans">{getFloodWarning(simulatedDepthFt)}</span>
        </div>
      </div>

    </div>
  );
};
