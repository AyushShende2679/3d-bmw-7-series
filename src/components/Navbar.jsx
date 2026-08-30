import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Sliders, ChevronRight } from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';

export const Navbar = ({
  activeSection,
  onNavigate,
  onOpenSoundModal,
  onOpenCustomizer,
  onOpenConfigurator,
  isCustomizerOpen
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Overview', progress: 0.02 },
    { label: 'Design', progress: 0.22 },
    { label: 'Powertrain', progress: 0.45 },
    { label: 'Intelligence', progress: 0.65 },
    { label: 'Interior', progress: 0.80 },
    { label: 'Specs', progress: 0.98 }
  ];

  const handleAudioToggle = () => {
    audioSynth.playUiTick();
    const muted = audioSynth.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-2xl'
          : 'bg-transparent py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Monogram & Model */}
        <button
          onClick={() => {
            audioSynth.playUiTick();
            onNavigate(0);
          }}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          {/* BMW Roundel Logo */}
          <div className="w-8 h-8 rounded-full border border-white/20 p-0.5 relative flex items-center justify-center group-hover:border-[#1c69d4] transition-colors">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="#050505" stroke="#ffffff" strokeWidth="3" />
              <circle cx="50" cy="50" r="42" fill="#0066b1" />
              <path d="M50 8 A42 42 0 0 1 92 50 L50 50 Z" fill="#ffffff" />
              <path d="M50 92 A42 42 0 0 1 8 50 L50 50 Z" fill="#ffffff" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#050505" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-[0.2em] text-white font-display uppercase group-hover:text-[#41adff] transition-colors">
              BMW
            </span>
            <span className="text-[10px] tracking-widest text-white/50 font-mono-tech -mt-0.5">
              7 SERIES
            </span>
          </div>
        </button>

        {/* Center: Minimal Navigation Anchors (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = activeSection.toLowerCase() === item.label.toLowerCase();
            return (
              <button
                key={item.label}
                onClick={() => {
                  audioSynth.playUiTick();
                  onNavigate(item.progress);
                }}
                onMouseEnter={() => audioSynth.playUiTick(1600)}
                className={`px-3.5 py-1 text-xs tracking-wider font-medium transition-all duration-300 rounded-full ${
                  isActive
                    ? 'text-white bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.1)]'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Sound Simulator, Paint Customizer & Build CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Engine Rev Sound Simulator Trigger */}
          <button
            onClick={() => {
              audioSynth.playUiTick();
              onOpenSoundModal();
            }}
            onMouseEnter={() => audioSynth.playUiTick(1400)}
            title="Start V8 Engine Sound Simulator"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/80 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white border border-white/[0.08] hover:border-[#1c69d4]/60 rounded-full transition-all duration-300"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="hidden sm:inline font-mono-tech text-[11px] tracking-wider">V8 SOUND</span>
          </button>

          {/* Color Customizer Toggle */}
          <button
            onClick={() => {
              audioSynth.playUiTick();
              onOpenCustomizer();
            }}
            onMouseEnter={() => audioSynth.playUiTick(1400)}
            title="Customize Exterior Paint"
            className={`p-2 rounded-full border transition-all duration-300 ${
              isCustomizerOpen
                ? 'bg-[#1c69d4] text-white border-[#1c69d4] shadow-[0_0_12px_rgba(28,105,212,0.5)]'
                : 'bg-white/[0.04] text-white/80 hover:text-white border-white/[0.08] hover:border-white/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={handleAudioToggle}
            title={isMuted ? 'Unmute Atmosphere' : 'Mute Atmosphere'}
            className="p-2 rounded-full bg-white/[0.04] text-white/60 hover:text-white border border-white/[0.08] hover:border-white/20 transition-all duration-300"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Primary CTA: Build Yours */}
          <button
            onClick={() => {
              audioSynth.playUiTick(1800);
              onOpenConfigurator();
            }}
            onMouseEnter={() => audioSynth.playUiTick(1500)}
            className="group relative inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold tracking-wider text-white bg-white/[0.08] hover:bg-[#1c69d4] border border-white/20 hover:border-[#1c69d4] rounded-full transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(28,105,212,0.4)] overflow-hidden"
          >
            <span>BUILD YOURS</span>
            <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
