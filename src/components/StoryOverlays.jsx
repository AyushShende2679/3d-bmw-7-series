import React from 'react';
import { ChevronDown, ArrowRight, Gauge, Cpu, ShieldCheck, Sparkles, SlidersHorizontal } from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';

export const StoryOverlays = ({ scrollProgress, onOpenConfigurator, onOpenSoundModal, onScrollToSpecs }) => {
  // Helpers for opacity and visibility based on scroll ranges
  const getBeatVisibility = (start, peakStart, peakEnd, end) => {
    if (scrollProgress < start || scrollProgress > end) return { opacity: 0, pointerEvents: 'none', translateY: 20 };
    
    let opacity = 1;
    let translateY = 0;

    if (scrollProgress < peakStart) {
      const t = (scrollProgress - start) / (peakStart - start);
      opacity = t;
      translateY = 20 * (1 - t);
    } else if (scrollProgress > peakEnd) {
      const t = (scrollProgress - peakEnd) / (end - peakEnd);
      opacity = 1 - t;
      translateY = -20 * t;
    }

    return {
      opacity: Math.max(0, Math.min(1, opacity)),
      pointerEvents: opacity > 0.3 ? 'auto' : 'none',
      transform: `translateY(${translateY}px)`
    };
  };

  const beat1 = getBeatVisibility(0, 0.02, 0.12, 0.16);
  const beat2 = getBeatVisibility(0.16, 0.22, 0.30, 0.35);
  const beat3 = getBeatVisibility(0.35, 0.40, 0.50, 0.55);
  const beat4 = getBeatVisibility(0.55, 0.60, 0.68, 0.73);
  const beat5 = getBeatVisibility(0.73, 0.77, 0.84, 0.88);
  const beat6 = getBeatVisibility(0.88, 0.92, 0.99, 1.0);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
      {/* Beat 1: Hero / The Ultimate Expression of Performance */}
      <div
        style={beat1}
        className="my-auto max-w-2xl transition-all duration-300"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 mb-4 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1c69d4] animate-pulse" />
          <span className="text-[11px] font-mono-tech tracking-[0.2em] text-white/80 uppercase">
            Flagship Engineering
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-metallic font-display leading-[1.05] mb-4">
          BMW 7 Series
        </h1>
        
        <p className="text-xl sm:text-2xl font-light text-white/90 mb-3 tracking-wide">
          The ultimate expression of performance.
        </p>

        <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed max-w-lg mb-8">
          Precision, power and presence — engineered without compromise.
        </p>

        {/* Hero Quick Telemetry Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 border-t border-white/10 max-w-lg">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-white">536 <span className="text-xs font-mono-tech font-normal text-[#1c69d4]">HP</span></div>
            <div className="text-[11px] font-mono-tech text-white/50 uppercase tracking-wider">TwinPower V8</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-white">4.1 <span className="text-xs font-mono-tech font-normal text-[#1c69d4]">SEC</span></div>
            <div className="text-[11px] font-mono-tech text-white/50 uppercase tracking-wider">0-60 MPH</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-white">750 <span className="text-xs font-mono-tech font-normal text-[#1c69d4]">NM</span></div>
            <div className="text-[11px] font-mono-tech text-white/50 uppercase tracking-wider">Max Torque</div>
          </div>
        </div>

        {/* Scroll CTA */}
        <div className="mt-10 flex items-center gap-3 text-white/40 text-xs font-mono-tech tracking-widest uppercase animate-bounce">
          <ChevronDown className="w-4 h-4 text-[#1c69d4]" />
          <span>Scroll to deconstruct anatomy</span>
        </div>
      </div>

      {/* Beat 2: Design Reveal */}
      <div
        style={beat2}
        className="my-auto max-w-xl transition-all duration-300"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#41adff]" />
          <span className="text-[11px] font-mono-tech tracking-[0.2em] text-white/80 uppercase">
            Aerodynamic Form
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-metallic font-display leading-tight mb-4">
          Designed to command attention.
        </h2>

        <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed mb-4">
          Every surface is shaped by purpose. Every line carries motion.
        </p>

        <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
          From its unmistakable illuminated kidney grille to its sculpted monolithic stance, every contour directs airflow to optimize high-speed downforce and cooling efficiency.
        </p>

        <div className="flex flex-wrap gap-2">
          {['Active Air Flap Control', 'Iconic Laserlight Optics', 'Carbon Core Monocoque'].map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-mono-tech bg-white/[0.04] border border-white/10 text-white/80">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Beat 3: Performance & Powertrain */}
      <div
        style={beat3}
        className="my-auto ml-auto max-w-lg text-right transition-all duration-300"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 mb-4 backdrop-blur-md">
          <Gauge className="w-3.5 h-3.5 text-[#1c69d4]" />
          <span className="text-[11px] font-mono-tech tracking-[0.2em] text-white/80 uppercase">
            M Performance V8
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-metallic font-display leading-tight mb-4">
          Power, precisely controlled.
        </h2>

        <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed mb-6">
          Engineered to turn every input into immediate, confident motion.
        </p>

        <div className="space-y-3 mb-6 inline-block text-left w-full sm:w-auto">
          <div className="p-3.5 rounded-xl glass-panel border border-white/10 flex items-center justify-between gap-6">
            <span className="text-xs font-mono-tech text-white/60">INSTANT RESPONSE</span>
            <span className="text-xs font-mono-tech text-[#41adff] font-medium">Twin-Scroll Turbos</span>
          </div>
          <div className="p-3.5 rounded-xl glass-panel border border-white/10 flex items-center justify-between gap-6">
            <span className="text-xs font-mono-tech text-white/60">BALANCED HANDLING</span>
            <span className="text-xs font-mono-tech text-[#41adff] font-medium">50:50 Axle Weight</span>
          </div>
          <div className="p-3.5 rounded-xl glass-panel border border-white/10 flex items-center justify-between gap-6">
            <span className="text-xs font-mono-tech text-white/60">RELENTLESS TRACTION</span>
            <span className="text-xs font-mono-tech text-[#41adff] font-medium">xDrive Intelligent AWD</span>
          </div>
        </div>

        <div>
          <button
            onClick={() => {
              audioSynth.playUiTick();
              onOpenSoundModal();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono-tech text-white bg-[#1c69d4] hover:bg-[#0066b1] transition-all shadow-[0_0_15px_rgba(28,105,212,0.4)]"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            LISTEN TO V8 TWINPOWER EXHAUST
          </button>
        </div>
      </div>

      {/* Beat 4: Intelligence & Cockpit Technology */}
      <div
        style={beat4}
        className="my-auto max-w-xl transition-all duration-300"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 mb-4 backdrop-blur-md">
          <Cpu className="w-3.5 h-3.5 text-[#41adff]" />
          <span className="text-[11px] font-mono-tech tracking-[0.2em] text-white/80 uppercase">
            Cognitive Driving System
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-metallic font-display leading-tight mb-4">
          Intelligence in every drive.
        </h2>

        <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed mb-4">
          Technology disappears into the experience, giving you exactly what you need — when you need it.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-lg glass-panel-subtle border border-white/10">
            <div className="text-xs font-semibold text-white mb-1">BMW Curved Display</div>
            <div className="text-[11px] text-white/50 leading-relaxed">14.9" Central Display fused with 12.3" Driver Cluster in frameless glass.</div>
          </div>
          <div className="p-3 rounded-lg glass-panel-subtle border border-white/10">
            <div className="text-xs font-semibold text-white mb-1">Driving Assistant Pro</div>
            <div className="text-[11px] text-white/50 leading-relaxed">Level 2+ Hands-Free highway assistance and automated 3D collision evasion.</div>
          </div>
        </div>
      </div>

      {/* Beat 5: Interior & Craftsmanship */}
      <div
        style={beat5}
        className="my-auto ml-auto max-w-lg text-right transition-all duration-300"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 mb-4 backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span className="text-[11px] font-mono-tech tracking-[0.2em] text-white/80 uppercase">
            Bespoke Luxury
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-metallic font-display leading-tight mb-4">
          Crafted around the driver.
        </h2>

        <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed mb-4">
          Every surface, control and material is designed to make the cockpit feel unmistakably yours.
        </p>

        <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
          Luxury is not added. It is engineered into every detail — from quilted Individual Merino leather to faceted crystal controls with tactile haptic feedback.
        </p>

        <div className="flex flex-wrap gap-2 justify-end">
          {['Merino Leather Lounge', 'Bowers & Wilkins 4D Diamond Audio', 'Sky Lounge Panoramic Glass'].map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-mono-tech bg-white/[0.04] border border-white/10 text-white/80">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Beat 6: Final Hero & Conversion */}
      <div
        style={beat6}
        className="my-auto mx-auto max-w-3xl text-center transition-all duration-300"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 mb-4 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#1c69d4]" />
          <span className="text-[11px] font-mono-tech tracking-[0.25em] text-white/90 uppercase">
            The Pinnacle of Luxury
          </span>
        </div>

        <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-metallic font-display leading-[1.0] mb-4">
          Made to move you.
        </h2>

        <p className="text-lg sm:text-2xl text-white/90 font-light tracking-wide max-w-xl mx-auto mb-3">
          BMW 7 Series. Engineered for those who refuse ordinary.
        </p>

        <p className="text-xs sm:text-sm font-mono-tech text-white/50 tracking-widest uppercase mb-8">
          Performance • Design • Intelligence • In Perfect Balance
        </p>

        {/* Primary Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              audioSynth.playUiTick(1900);
              onOpenConfigurator();
            }}
            onMouseEnter={() => audioSynth.playUiTick(1500)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold tracking-wider text-white bg-[#1c69d4] hover:bg-[#0066b1] transition-all shadow-[0_0_30px_rgba(28,105,212,0.5)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>BUILD YOURS</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              audioSynth.playUiTick(1400);
              onScrollToSpecs();
            }}
            onMouseEnter={() => audioSynth.playUiTick(1300)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold tracking-wider text-white/90 bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 transition-all hover:border-white/40 flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-white/60" />
            <span>EXPLORE SPECIFICATIONS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
