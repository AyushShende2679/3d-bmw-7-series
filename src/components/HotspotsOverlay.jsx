import React, { useState } from 'react';
import { X, Cpu, Gauge, Shield, Zap, Wind, Disc } from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';

const HOTSPOTS_DATA = [
  {
    id: 'engine',
    title: '4.4L BMW M TwinPower Turbo V8',
    subsystem: 'POWERTRAIN // S68 V8 HYBRID',
    frameMin: 80,
    frameMax: 240,
    x: 42, // % from left
    y: 53, // % from top
    icon: Gauge,
    stats: [
      { label: 'DISPLACEMENT', value: '4,395 cc' },
      { label: 'OUTPUT', value: '536 HP @ 5,500 RPM' },
      { label: 'TORQUE', value: '750 Nm @ 1,800-5,400 RPM' },
      { label: 'BOOST PRESSURE', value: '1.45 Bar Twin-Scroll' }
    ],
    description: 'Direct fuel injection at 350 bar with centrally positioned twin turbochargers inside the "Hot V" bank for instantaneous throttle response.'
  },
  {
    id: 'transmission',
    title: '8-Speed M Steptronic Sport',
    subsystem: 'DRIVETRAIN // xDrive INTEGRATION',
    frameMin: 100,
    frameMax: 240,
    x: 53,
    y: 54,
    icon: Zap,
    stats: [
      { label: 'SHIFT DURATION', value: '120 ms' },
      { label: 'TORQUE SPLIT', value: 'Variable 0:100 to 50:50' },
      { label: 'LAUNCH CONTROL', value: 'Standard Dynamic' }
    ],
    description: 'Integrated 48V mild hybrid motor contributing an immediate 18 HP and 200 Nm of electric boost on standing starts.'
  },
  {
    id: 'seating',
    title: 'Executive Lounge Merino Seats',
    subsystem: 'INTERIOR // BESPOKE ERGONOMICS',
    frameMin: 110,
    frameMax: 240,
    x: 65,
    y: 36,
    icon: Shield,
    stats: [
      { label: 'LEATHER', value: 'Full Merino Natural Grain' },
      { label: 'MASSAGE PROGRAMS', value: '8 Multi-Zone Modes' },
      { label: 'RECLINE ANGLE', value: 'Up to 42.5°' }
    ],
    description: 'Active seat ventilation, heated armrests, integrated Bowers & Wilkins headrest transducers, and continuous lumbar support.'
  },
  {
    id: 'suspension',
    title: 'Adaptive 2-Axle Air Suspension',
    subsystem: 'CHASSIS // ACTIVE ROLL STABILIZATION',
    frameMin: 90,
    frameMax: 240,
    x: 77,
    y: 62,
    icon: Disc,
    stats: [
      { label: 'HEIGHT ADJUST', value: '+20mm to -10mm' },
      { label: 'DAMPING FREQUENCY', value: 'Every 2.5 Milliseconds' },
      { label: 'REAR STEER ANGLE', value: 'Up to 3.5° Active' }
    ],
    description: 'Electronically controlled dampers and 48V active anti-roll bars virtually eliminate body roll through aggressive cornering maneuvers.'
  },
  {
    id: 'carbon-core',
    title: 'Carbon Core Architecture',
    subsystem: 'BODY STRUCTURE // LIGHTWEIGHT HYBRID',
    frameMin: 170,
    frameMax: 240,
    x: 48,
    y: 25,
    icon: Cpu,
    stats: [
      { label: 'TORSIONAL RIGIDITY', value: '+30% vs Predecessor' },
      { label: 'WEIGHT SAVING', value: '130 kg Reduction' },
      { label: 'SAFETY CELL', value: 'CFRP Reinforced Safety Cage' }
    ],
    description: 'Carbon-fiber-reinforced polymer (CFRP) in the roof frame, pillars, and transmission tunnel creates an ultra-rigid, safe monocoque.'
  },
  {
    id: 'aero-flaps',
    title: 'Active Kidney Air Flap Control',
    subsystem: 'AERODYNAMICS // THERMAL MANAGEMENT',
    frameMin: 185,
    frameMax: 240,
    x: 16,
    y: 52,
    icon: Wind,
    stats: [
      { label: 'DRAG COEFFICIENT', value: 'Cd 0.24' },
      { label: 'COOLING STAGES', value: 'Multi-Level Intelligent' }
    ],
    description: 'Electronically actuated vertical vanes remain closed for lowest drag coefficient, opening dynamically only when thermal demands require.'
  }
];

export const HotspotsOverlay = ({ currentFrame }) => {
  const [activeHotspot, setActiveHotspot] = useState(null);

  // Filter hotspots valid for current frame range
  const visibleHotspots = HOTSPOTS_DATA.filter(
    (h) => currentFrame >= h.frameMin && currentFrame <= h.frameMax
  );

  if (visibleHotspots.length === 0 && !activeHotspot) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {/* Hotspot Markers */}
      {visibleHotspots.map((spot) => {
        const Icon = spot.icon;
        const isSelected = activeHotspot?.id === spot.id;

        return (
          <div
            key={spot.id}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto group z-20"
          >
            {/* Interactive Pulse Pin */}
            <button
              onClick={() => {
                audioSynth.playUiTick(1600);
                setActiveHotspot(isSelected ? null : spot);
              }}
              onMouseEnter={() => audioSynth.playUiTick(1300)}
              className={`relative flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 cursor-pointer ${isSelected
                  ? 'bg-[#1c69d4] border-white scale-110 shadow-[0_0_25px_#1c69d4]'
                  : 'bg-black/80 border-[#41adff]/70 hover:border-white hover:scale-115 shadow-xl'
                }`}
            >
              {/* Outer pulsing ring */}
              <span className="absolute inset-0 rounded-full bg-[#1c69d4]/40 hotspot-pulse -z-10" />

              <Icon className="w-4 h-4 text-white" />
            </button>

            {/* Quick hover label tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block whitespace-nowrap bg-black/95 text-white text-[10px] font-mono-tech px-3 py-1 rounded-full border border-white/20 shadow-2xl pointer-events-none backdrop-blur-xl">
              {spot.title}
            </div>
          </div>
        );
      })}

      {/* Expanded Telemetry Modal for Selected Hotspot */}
      {activeHotspot && (
        <div className="fixed bottom-20 left-6 right-6 sm:left-auto sm:right-10 sm:w-[420px] pointer-events-auto z-30 animate-fade-in">
          <div className="glass-card rounded-2xl p-6 relative border border-white/20 shadow-2xl bg-black/85 backdrop-blur-2xl">
            {/* Close Button */}
            <button
              onClick={() => {
                audioSynth.playUiTick(1100);
                setActiveHotspot(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Subsystem */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#1c69d4] animate-pulse" />
              <span className="text-[10px] font-mono-tech tracking-widest text-[#41adff] uppercase">
                {activeHotspot.subsystem}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white font-display mb-2">
              {activeHotspot.title}
            </h3>

            <p className="text-xs text-white/70 leading-relaxed font-light mb-4">
              {activeHotspot.description}
            </p>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/10">
              {activeHotspot.stats.map((stat, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                  <div className="text-[10px] font-mono-tech text-white/40 uppercase tracking-wider mb-0.5">
                    {stat.label}
                  </div>
                  <div className="text-xs font-semibold text-white font-mono-tech">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
