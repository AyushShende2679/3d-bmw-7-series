import React, { useState, useEffect, useRef } from 'react';
import { preloadSequence, TOTAL_FRAMES } from './utils/sequenceLoader';
import { audioSynth } from './utils/audioSynthesizer';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { ScrollyCanvas } from './components/ScrollyCanvas';
import { StoryOverlays } from './components/StoryOverlays';
import { HotspotsOverlay } from './components/HotspotsOverlay';
import { TelemetryHud } from './components/TelemetryHud';
import { ColorCustomizer, PAINT_OPTIONS } from './components/ColorCustomizer';
import { EngineSoundModal } from './components/EngineSoundModal';
import { ConfiguratorModal } from './components/ConfiguratorModal';
import { SpecsSection } from './components/SpecsSection';

export default function App() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('Overview');
  
  // Modals & UI States
  const [selectedColor, setSelectedColor] = useState(PAINT_OPTIONS[0]);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);

  const containerRef = useRef(null);

  // Preload frames on initial mount
  useEffect(() => {
    preloadSequence((prog) => {
      setLoadProgress(prog);
      if (prog >= 100) {
        setTimeout(() => setIsReady(true), 400);
      }
    });
  }, []);

  // Track window scroll progress relative to the 450vh scrollytelling container
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const totalScrollHeight = containerRef.current.scrollHeight - window.innerHeight;
      if (totalScrollHeight <= 0) return;

      const currentScroll = Math.max(0, window.scrollY);
      const progress = Math.min(1, Math.max(0, currentScroll / totalScrollHeight));
      setScrollProgress(progress);

      // Determine active nav section based on progress
      if (progress < 0.16) setActiveSection('Overview');
      else if (progress < 0.35) setActiveSection('Design');
      else if (progress < 0.55) setActiveSection('Powertrain');
      else if (progress < 0.73) setActiveSection('Intelligence');
      else if (progress < 0.88) setActiveSection('Interior');
      else setActiveSection('Specs');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Programmatic scroll handler for navigation clicks
  const handleNavigateToProgress = (targetProgress) => {
    if (!containerRef.current) return;
    const totalScrollHeight = containerRef.current.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetProgress * totalScrollHeight,
      behavior: 'smooth'
    });
  };

  const handleScrollToSpecs = () => {
    const specsEl = document.getElementById('specs-section');
    if (specsEl) {
      specsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentFrame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(1 + scrollProgress * (TOTAL_FRAMES - 1))));

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#1c69d4] selection:text-white">
      {/* 1. Preloader Screen */}
      <Preloader progress={loadProgress} isReady={isReady} />

      {/* 2. Frosted Glass Top Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigateToProgress}
        onOpenSoundModal={() => setIsSoundModalOpen(true)}
        onOpenCustomizer={() => setIsCustomizerOpen((prev) => !prev)}
        onOpenConfigurator={() => setIsConfiguratorOpen(true)}
        isCustomizerOpen={isCustomizerOpen}
      />

      {/* 3. High-DPI Sticky Canvas Engine */}
      <ScrollyCanvas
        scrollProgress={scrollProgress}
        selectedColor={selectedColor}
      />

      {/* 4. Interactive 3D Component Hotspots */}
      <HotspotsOverlay currentFrame={currentFrame} />

      {/* 5. Dynamic Editorial Storytelling Overlays */}
      <StoryOverlays
        scrollProgress={scrollProgress}
        onOpenConfigurator={() => setIsConfiguratorOpen(true)}
        onOpenSoundModal={() => setIsSoundModalOpen(true)}
        onScrollToSpecs={handleScrollToSpecs}
      />

      {/* 6. Real-Time Telemetry HUD & Scrubber Bar */}
      <TelemetryHud
        scrollProgress={scrollProgress}
        onScrub={handleNavigateToProgress}
      />

      {/* 7. Floating Color Paint Customizer */}
      <ColorCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />

      {/* 8. Web Audio V8 Engine Sound Simulator Modal */}
      <EngineSoundModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
      />

      {/* 9. Bespoke "Build Yours" Configurator Modal */}
      <ConfiguratorModal
        isOpen={isConfiguratorOpen}
        onClose={() => setIsConfiguratorOpen(false)}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />

      {/* Main Scrollytelling Track Height (450vh provides silky smooth frame transitions) */}
      <div
        ref={containerRef}
        className="relative w-full h-[450vh] pointer-events-none"
      />

      {/* 10. Technical Telemetry Dossier & Engineering Specs Section */}
      <SpecsSection
        onOpenConfigurator={() => setIsConfiguratorOpen(true)}
      />

      {/* 11. Luxury Editorial Footer */}
      <footer className="relative z-30 bg-[#030304] border-t border-white/10 py-16 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Brand Identity */}
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-full border border-white/20 p-0.5 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="48" fill="#050505" stroke="#ffffff" strokeWidth="3" />
                <circle cx="50" cy="50" r="42" fill="#0066b1" />
                <path d="M50 8 A42 42 0 0 1 92 50 L50 50 Z" fill="#ffffff" />
                <path d="M50 92 A42 42 0 0 1 8 50 L50 50 Z" fill="#ffffff" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#050505" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold font-display tracking-[0.2em] uppercase">Bayerische Motoren Werke AG</div>
              <div className="text-xs font-mono-tech text-white/50">BMW 7 Series Flagship Digital Experience</div>
            </div>
          </div>

          {/* Center Links */}
          <div className="flex items-center gap-6 text-xs font-mono-tech text-white/60">
            <button onClick={() => handleNavigateToProgress(0)} className="hover:text-white transition-colors">OVERVIEW</button>
            <button onClick={() => handleNavigateToProgress(0.45)} className="hover:text-white transition-colors">POWERTRAIN</button>
            <button onClick={() => handleNavigateToProgress(0.80)} className="hover:text-white transition-colors">INTERIOR</button>
            <button onClick={handleScrollToSpecs} className="hover:text-white transition-colors">SPECS</button>
          </div>

          {/* Right Disclaimer */}
          <div className="text-right text-[11px] font-mono-tech text-white/40">
            © 2026 BMW AG • Engineered with Bavarian Precision
          </div>
        </div>
      </footer>
    </div>
  );
}
