import React, { useState } from 'react';
import { Gauge, Cpu, Shield, Wind, Download, Check, ExternalLink } from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';

const SPECS_CATEGORIES = [
  {
    id: 'powertrain',
    name: 'Powertrain & Dynamics',
    icon: Gauge,
    items: [
      { label: 'Engine Type', value: '4.4-Liter BMW M TwinPower Turbo V8 32-Valve' },
      { label: 'Maximum Horsepower', value: '536 HP @ 5,500 - 6,000 RPM' },
      { label: 'Peak Torque', value: '750 Nm (553 lb-ft) @ 1,800 - 5,400 RPM' },
      { label: 'Acceleration (0-60 MPH)', value: '4.1 Seconds (Official)' },
      { label: 'Top Speed', value: '155 MPH (Electronically Limited) / 180 MPH (M Driver\'s Pkg)' },
      { label: 'Transmission', value: '8-Speed M Steptronic Sport with Launch Control' },
      { label: 'Drivetrain', value: 'xDrive Intelligent All-Wheel Drive with Rear Bias' },
      { label: 'Hybrid System', value: '48V Mild Hybrid e-Boost Generator (18 HP / 200 Nm)' }
    ]
  },
  {
    id: 'chassis',
    name: 'Chassis & Handling',
    icon: Shield,
    items: [
      { label: 'Suspension Front/Rear', value: 'Adaptive 2-Axle Air Suspension with Dynamic Damper Control' },
      { label: 'Active Anti-Roll', value: 'Executive Drive Pro with 48V Active Roll Stabilization' },
      { label: 'Steering System', value: 'Integral Active Steering (Up to 3.5° Rear Axle Steering)' },
      { label: 'Braking Architecture', value: 'M Sport Brakes with 4-Piston Fixed Calipers (395mm Rotors)' },
      { label: 'Weight Distribution', value: '50.2% Front / 49.8% Rear Balanced Architecture' },
      { label: 'Body Structure', value: 'Carbon Core Hybrid (CFRP, High-Strength Steel & Aluminum)' }
    ]
  },
  {
    id: 'dimensions',
    name: 'Dimensions & Aero',
    icon: Wind,
    items: [
      { label: 'Drag Coefficient (Cd)', value: '0.24 (Active Air Flaps Closed)' },
      { label: 'Overall Length', value: '5,391 mm (212.2 in)' },
      { label: 'Overall Width', value: '1,950 mm (76.8 in)' },
      { label: 'Overall Height', value: '1,544 mm (60.8 in)' },
      { label: 'Wheelbase', value: '3,215 mm (126.6 in)' },
      { label: 'Curb Weight', value: '2,270 kg (5,004 lbs)' },
      { label: 'Luggage Capacity', value: '540 Liters (19.1 cu ft)' }
    ]
  },
  {
    id: 'technology',
    name: 'Digital Cockpit & Audio',
    icon: Cpu,
    items: [
      { label: 'Display Architecture', value: 'BMW Curved Display (12.3" Cluster + 14.9" Central Screen)' },
      { label: 'Operating System', value: 'BMW Operating System 8.5 with QuickSelect UI' },
      { label: 'Audio System', value: 'Bowers & Wilkins Diamond Surround Sound (36 Speakers, 1,965W)' },
      { label: 'Driver Assistance', value: 'Driving Assistant Professional with Hands-Free Highway Assist' },
      { label: 'Lighting Technology', value: 'Adaptive LED Headlights with Iconic Glow Crystal Elements' },
      { label: 'Rear Cabin Feature', value: '31.3" 8K BMW Theatre Screen with 5.5" Touch Remotes in Doors' }
    ]
  }
];

export const SpecsSection = ({ onOpenConfigurator }) => {
  const [activeTab, setActiveTab] = useState('powertrain');
  const currentCategory = SPECS_CATEGORIES.find((c) => c.id === activeTab) || SPECS_CATEGORIES[0];

  return (
    <section id="specs-section" className="relative z-30 bg-[#050505] py-24 sm:py-32 px-6 sm:px-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1c69d4]" />
            <span className="text-[11px] font-mono-tech tracking-[0.2em] text-[#41adff] uppercase">
              Technical Telemetry Dossier
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-display mb-4">
            Engineered Without Compromise.
          </h2>

          <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed">
            Every millimeter and tolerance in the BMW 7 Series is refined through rigorous dyno testing, Nürburgring calibration, and aerodynamic wind-tunnel simulation.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {SPECS_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  audioSynth.playUiTick(1500);
                  setActiveTab(cat.id);
                }}
                onMouseEnter={() => audioSynth.playUiTick(1300)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${isActive
                    ? 'bg-[#1c69d4] text-white shadow-[0_0_20px_rgba(28,105,212,0.4)] scale-105'
                    : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Specs Table Matrix */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {currentCategory.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-baseline justify-between py-3 border-b border-white/[0.06] group"
              >
                <span className="text-xs font-mono-tech text-white/50 group-hover:text-white/80 transition-colors uppercase tracking-wider mb-1 sm:mb-0">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-white font-mono-tech text-right">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Conversion Strip */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0a0a0c] via-[#10131a] to-[#0a0a0c] border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold text-white font-display mb-1">
              Ready to experience Bavarian performance?
            </h4>
            <p className="text-xs text-white/60 font-light">
              Configure your bespoke BMW 7 Series with custom finishes, wheels, and M Sport packages.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                audioSynth.playUiTick(1800);
                onOpenConfigurator();
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-bold tracking-wider text-white bg-[#1c69d4] hover:bg-[#0066b1] transition-all shadow-[0_0_20px_rgba(28,105,212,0.5)] whitespace-nowrap"
            >
              BUILD YOUR 7 SERIES
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
