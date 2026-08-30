import React from 'react';
import { Eye, Layers, Compass, Play, Pause } from 'lucide-react';
import { TOTAL_FRAMES } from '../utils/sequenceLoader';
import { audioSynth } from '../utils/audioSynthesizer';

const getSubsystemState = (frame) => {
  if (frame <= 35) return 'STATE 01 // SILHOUETTE_HERO';
  if (frame <= 85) return 'STATE 02 // AERO_DECONSTRUCTION';
  if (frame <= 145) return 'STATE 03 // V8_POWERTRAIN_EXPLODED';
  if (frame <= 185) return 'STATE 04 // CHASSIS_INTELLIGENCE';
  if (frame <= 220) return 'STATE 05 // EXECUTIVE_COCKPIT';
  return 'STATE 06 // ARCHITECTURAL_CONVERGENCE';
};

export const TelemetryHud = ({
  scrollProgress,
  onScrub
}) => {
  const currentFrame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(1 + scrollProgress * (TOTAL_FRAMES - 1))));
  const systemState = getSubsystemState(currentFrame);

  const handleBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));
    audioSynth.playUiTick(1600);
    onScrub(progress);
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 z-30 pointer-events-none flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: Engineering Subsystem Telemetry */}
      <div className="flex items-center gap-3 px-3.5 py-2 rounded-full glass-panel border border-white/10 pointer-events-auto backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#1c69d4] animate-pulse" />
        <span className="text-[10px] font-mono-tech tracking-widest text-white/80 uppercase">
          {systemState}
        </span>
      </div>

      {/* Center/Right: Interactive Frame Scrubber Bar */}
      <div className="flex items-center gap-4 px-4 py-2 rounded-full glass-panel border border-white/10 pointer-events-auto backdrop-blur-md max-w-md w-full sm:w-auto">
        <div className="text-[10px] font-mono-tech text-white/60 whitespace-nowrap">
          <span className="text-white font-bold">{String(currentFrame).padStart(3, '0')}</span>
          <span className="text-white/40"> / {TOTAL_FRAMES}</span>
        </div>

        {/* Scrub Track */}
        <div
          onClick={handleBarClick}
          className="relative flex-1 sm:w-36 h-2 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer overflow-hidden transition-colors"
          title="Click to jump across 3D sequence"
        >
          <div
            className="h-full bg-gradient-to-r from-[#0066b1] to-[#41adff] rounded-full transition-all duration-75 shadow-[0_0_8px_#1c69d4]"
            style={{ width: `${(currentFrame / TOTAL_FRAMES) * 100}%` }}
          />
        </div>

        <div className="text-[10px] font-mono-tech text-[#41adff] font-bold">
          {Math.round(scrollProgress * 100)}%
        </div>
      </div>
    </div>
  );
};
