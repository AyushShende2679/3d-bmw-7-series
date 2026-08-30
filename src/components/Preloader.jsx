import React, { useEffect, useState } from 'react';

const STATUS_MESSAGES = [
  "INITIALIZING 4.4L V8 TWINPOWER TURBO ARCHITECTURE",
  "CALIBRATING XDRIVE ALL-WHEEL SUSPENSION DYNAMICS",
  "PRE-RENDERING 240 ANATOMICAL HIGH-RESOLUTION FRAMES",
  "CONFIGURING CARBON CORE MONOCOQUE TELEMETRY",
  "READY FOR LAUNCH"
];

export const Preloader = ({ progress, isReady }) => {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  if (isReady && progress >= 100) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 transition-opacity duration-700 select-none">
      {/* Background ambient lighting */}
      <div className="ambient-glow w-[500px] h-[500px] -top-20 -left-20 opacity-30" />
      <div className="ambient-glow w-[400px] h-[400px] -bottom-20 -right-20 opacity-20" />

      <div className="relative flex flex-col items-center max-w-md w-full text-center z-10">
        {/* BMW Emblem Outline / Glowing Ring */}
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-white/10"
              strokeWidth="2"
              fill="none"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-[#1c69d4] transition-all duration-300 ease-out"
              strokeWidth="3"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progress) / 100}
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          {/* Center Brand Monogram */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold tracking-[0.25em] text-white font-display">BMW</span>
            <span className="text-[10px] tracking-widest text-bmw-muted font-mono-tech mt-0.5">7 SERIES</span>
          </div>
        </div>

        {/* Progress Percentage Display */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-5xl font-light font-display text-white tracking-tighter">
            {Math.min(100, Math.round(progress))}
          </span>
          <span className="text-sm font-mono-tech text-[#1c69d4] font-medium">%</span>
        </div>

        {/* Precision Progress Bar */}
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#41adff] transition-all duration-300 ease-out shadow-[0_0_12px_#1c69d4]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Telemetry Status */}
        <p className="text-[11px] font-mono-tech tracking-widest text-white/50 uppercase transition-all duration-300 min-h-[18px]">
          {STATUS_MESSAGES[statusIndex]}
        </p>
      </div>

      {/* Footer watermark */}
      <div className="absolute bottom-8 text-[11px] font-mono-tech tracking-[0.2em] text-white/30 uppercase">
        Bavarian Precision Engineering • Munich
      </div>
    </div>
  );
};
