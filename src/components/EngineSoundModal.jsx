import React, { useState, useEffect, useRef } from 'react';
import { X, Power, Gauge, Flame, Activity } from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';

export const EngineSoundModal = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [rpm, setRpm] = useState(800);
  const [isThrottling, setIsThrottling] = useState(false);
  const throttleIntervalRef = useRef(null);

  useEffect(() => {
    if (!isOpen && isRunning) {
      audioSynth.stopEngine();
      setIsRunning(false);
      setRpm(800);
    }
  }, [isOpen]);

  // Track RPM state for needle
  useEffect(() => {
    let animId;
    const updateRpmDisplay = () => {
      if (isRunning) {
        setRpm(Math.round(audioSynth.rpm));
      } else {
        setRpm(0);
      }
      animId = requestAnimationFrame(updateRpmDisplay);
    };
    animId = requestAnimationFrame(updateRpmDisplay);
    return () => cancelAnimationFrame(animId);
  }, [isRunning]);

  if (!isOpen) return null;

  const toggleEngine = () => {
    audioSynth.playUiTick(1200);
    if (isRunning) {
      audioSynth.stopEngine();
      setIsRunning(false);
    } else {
      audioSynth.startEngine();
      setIsRunning(true);
    }
  };

  const handleThrottleStart = () => {
    if (!isRunning) return;
    setIsThrottling(true);
    audioSynth.setThrottle(0.9);
  };

  const handleThrottleEnd = () => {
    if (!isRunning) return;
    setIsThrottling(false);
    audioSynth.setThrottle(0.0);
    audioSynth.triggerExhaustPop();
  };

  // Tachometer angle calculation (-120deg at 0 RPM to +120deg at 8000 RPM)
  const tachAngle = -120 + (rpm / 8000) * 240;
  const boostPressure = isRunning ? (0.2 + (rpm / 7000) * 1.25).toFixed(2) : '0.00';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-white/20 shadow-[0_0_80px_rgba(0,102,177,0.25)] text-center overflow-hidden">
        {/* Background ambient accents */}
        <div className="ambient-glow w-[300px] h-[300px] -top-20 -right-20 opacity-30" />
        <div className="ambient-glow w-[300px] h-[300px] -bottom-20 -left-20 opacity-20" />

        {/* Close Button */}
        <button
          onClick={() => {
            audioSynth.playUiTick(1100);
            if (isRunning) {
              audioSynth.stopEngine();
              setIsRunning(false);
            }
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 mb-2">
          <Activity className="w-3.5 h-3.5 text-[#1c69d4] animate-pulse" />
          <span className="text-[10px] font-mono-tech tracking-[0.2em] text-[#41adff] uppercase">
            BMW M Sound Acoustic Lab
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mb-1">
          4.4L V8 TwinPower Turbo Acoustics
        </h3>
        <p className="text-xs text-white/50 font-mono-tech tracking-wider uppercase mb-6">
          Direct Web Audio Synthesis • Hot-V Twin-Scroll Exhaust System
        </p>

        {/* Digital Tachometer Gauge */}
        <div className="relative w-56 h-56 mx-auto mb-6 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background Dial Track */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="10"
              strokeDasharray="377"
              strokeDashoffset="125"
              strokeLinecap="round"
            />

            {/* Redline Arc */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#e00000"
              strokeWidth="10"
              strokeDasharray="377"
              strokeDashoffset="315"
              strokeLinecap="round"
              className="opacity-70"
            />

            {/* Active RPM Arc */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={rpm > 6200 ? '#e00000' : '#1c69d4'}
              strokeWidth="10"
              strokeDasharray="377"
              strokeDashoffset={377 - ((rpm / 8000) * 250)}
              strokeLinecap="round"
              className="transition-all duration-75"
            />
          </svg>

          {/* Needle Indicator */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-75"
            style={{ transform: `rotate(${tachAngle}deg)` }}
          >
            <div className="w-[3px] h-20 bg-gradient-to-t from-transparent via-[#41adff] to-white rounded-full -translate-y-9 shadow-[0_0_10px_#41adff]" />
          </div>

          {/* Center RPM Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-white font-mono-tech tracking-tight">
              {rpm}
            </span>
            <span className="text-[10px] font-mono-tech text-white/50 uppercase tracking-widest -mt-0.5">
              RPM
            </span>
          </div>
        </div>

        {/* Live Engine Telemetry Strip */}
        <div className="grid grid-cols-3 gap-2.5 mb-6 text-left">
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="text-[9px] font-mono-tech text-white/40 uppercase">BOOST</div>
            <div className="text-xs font-bold text-white font-mono-tech">{boostPressure} <span className="text-[9px] font-normal text-white/50">BAR</span></div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="text-[9px] font-mono-tech text-white/40 uppercase">OIL TEMP</div>
            <div className="text-xs font-bold text-white font-mono-tech">{isRunning ? '96°C' : '--'}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="text-[9px] font-mono-tech text-white/40 uppercase">EXHAUST FLAP</div>
            <div className={`text-xs font-bold font-mono-tech ${isRunning ? 'text-green-400' : 'text-white/40'}`}>
              {isRunning ? 'SPORT+' : 'CLOSED'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Start / Stop Engine Button */}
          <button
            onClick={toggleEngine}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold font-mono-tech text-xs tracking-wider transition-all flex items-center justify-center gap-2.5 ${isRunning
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                : 'bg-[#1c69d4] text-white border border-[#1c69d4] hover:bg-[#0066b1] shadow-[0_0_25px_rgba(28,105,212,0.6)]'
              }`}
          >
            <Power className="w-4 h-4" />
            <span>{isRunning ? 'STOP ENGINE' : 'START V8 ENGINE'}</span>
          </button>

          {/* Hold to Throttle Pedal */}
          <button
            onMouseDown={handleThrottleStart}
            onMouseUp={handleThrottleEnd}
            onTouchStart={handleThrottleStart}
            onTouchEnd={handleThrottleEnd}
            disabled={!isRunning}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold font-mono-tech text-xs tracking-wider transition-all flex items-center justify-center gap-2.5 select-none ${!isRunning
                ? 'opacity-40 cursor-not-allowed bg-white/5 border border-white/10 text-white/40'
                : isThrottling
                  ? 'bg-white text-black scale-95 shadow-[0_0_30px_#ffffff]'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 active:scale-95'
              }`}
          >
            <Flame className={`w-4 h-4 ${isThrottling ? 'text-orange-500 animate-bounce' : 'text-white/60'}`} />
            <span>PRESS & HOLD THROTTLE</span>
          </button>
        </div>

        {isRunning && (
          <p className="mt-4 text-[10px] font-mono-tech text-white/40 tracking-wider">
            Tip: Release throttle quickly to hear high-RPM exhaust overrun crackles & turbo blow-off.
          </p>
        )}
      </div>
    </div>
  );
};
