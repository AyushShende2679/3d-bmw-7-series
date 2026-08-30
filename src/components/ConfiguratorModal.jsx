import React, { useState } from 'react';
import { X, Check, ArrowRight, ShieldCheck, Sparkles, ChevronRight, Download } from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';
import { PAINT_OPTIONS } from './ColorCustomizer';

const MODELS = [
  {
    id: '760i',
    name: 'BMW 760i xDrive Sedan',
    engine: '4.4L V8 TwinPower Turbo',
    hp: '536 HP',
    accel: '4.1s',
    basePrice: 121300
  },
  {
    id: '740i',
    name: 'BMW 740i xDrive Sedan',
    engine: '3.0L TwinPower Turbo Inline-6',
    hp: '375 HP',
    accel: '4.9s',
    basePrice: 99700
  },
  {
    id: 'i7-m70',
    name: 'BMW i7 M70 xDrive All-Electric',
    engine: 'Dual M eDrive High-Performance',
    hp: '650 HP',
    accel: '3.5s',
    basePrice: 168500
  }
];

const WHEELS = [
  {
    id: 'w-20-m',
    name: '20" M Aerodynamic Wheels 907M Bi-Color',
    price: 0,
    type: 'Included'
  },
  {
    id: 'w-21-ind',
    name: '21" BMW Individual Multi-Spoke Style 1055',
    price: 1300,
    type: 'Optional'
  },
  {
    id: 'w-21-m-black',
    name: '21" M Star-Spoke 908M Jet Black Performance',
    price: 1800,
    type: 'Optional'
  }
];

const INTERIORS = [
  {
    id: 'int-black',
    name: 'Black Extended Merino Leather',
    swatch: '#1a1a1a',
    price: 0
  },
  {
    id: 'int-tartufo',
    name: 'Tartufo Full Merino Leather',
    swatch: '#8c4a2f',
    price: 1500
  },
  {
    id: 'int-smoke-white',
    name: 'Smoke White Full Merino Leather & Cashmere',
    swatch: '#e5e7eb',
    price: 2000
  },
  {
    id: 'int-amarone',
    name: 'Amarone Deep Red Merino Leather',
    swatch: '#581c24',
    price: 1500
  }
];

const PACKAGES = [
  {
    id: 'pkg-m-sport-pro',
    name: 'M Sport Professional Package',
    desc: 'M Sport Brakes with Blue/Red Calipers, M Rear Spoiler, Extended Shadowline Trim',
    price: 1300
  },
  {
    id: 'pkg-exec-lounge',
    name: 'Executive Lounge Seating Package',
    desc: 'Reclining Rear Seat with Footrest, Active Seat Ventilation, 8-Mode Massage',
    price: 7250
  },
  {
    id: 'pkg-bowers',
    name: 'Bowers & Wilkins Diamond Surround Sound',
    desc: '36 High-Performance Speakers, 4D Audio Transducers, 1,965 Watts',
    price: 4800
  },
  {
    id: 'pkg-driving-pro',
    name: 'Driving Assistance Professional Package',
    desc: 'Highway Assistant (Hands-Free up to 85 mph), Active Lane Change Assistant',
    price: 2500
  }
];

export const ConfiguratorModal = ({ isOpen, onClose, selectedColor, onSelectColor }) => {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [selectedWheel, setSelectedWheel] = useState(WHEELS[0]);
  const [selectedInterior, setSelectedInterior] = useState(INTERIORS[0]);
  const [selectedPackages, setSelectedPackages] = useState(['pkg-m-sport-pro', 'pkg-bowers']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  if (!isOpen) return null;

  const togglePackage = (pkgId) => {
    audioSynth.playUiTick(1500);
    setSelectedPackages((prev) =>
      prev.includes(pkgId) ? prev.filter((p) => p !== pkgId) : [...prev, pkgId]
    );
  };

  // Calculate Total MSRP
  const packagesTotal = PACKAGES.filter((p) => selectedPackages.includes(p.id)).reduce(
    (acc, curr) => acc + curr.price,
    0
  );
  const totalMSRP =
    selectedModel.basePrice + selectedWheel.price + selectedInterior.price + packagesTotal;
  const estimatedMonthly = Math.round(totalMSRP / 60 * 1.04);
  const buildCode = `BMW-${selectedModel.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleSubmitBuild = () => {
    audioSynth.playUiTick(1900);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/90 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl glass-card rounded-3xl p-6 sm:p-10 border border-white/20 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            audioSynth.playUiTick(1100);
            setIsSubmitted(false);
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Confirmation View */
          <div className="py-12 text-center max-w-lg mx-auto my-auto animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#1c69d4]/20 border border-[#1c69d4] flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-[#41adff]" />
            </div>

            <div className="text-xs font-mono-tech tracking-widest text-[#41adff] uppercase mb-2">
              Configuration Saved • Munich Concierge Assigned
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold text-white font-display mb-4">
              Your BMW 7 Series Is Ready.
            </h3>

            <p className="text-sm text-white/70 font-light leading-relaxed mb-6">
              Your custom bespoke build has been recorded under digital reference{' '}
              <span className="font-mono-tech font-bold text-white bg-white/10 px-2 py-1 rounded">
                {buildCode}
              </span>
              . A BMW Luxury Brand Specialist will contact you to finalize production allocation.
            </p>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-left mb-8 font-mono-tech text-xs space-y-1.5">
              <div className="flex justify-between text-white/60">
                <span>MODEL:</span> <span className="text-white font-medium">{selectedModel.name}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>PAINT:</span> <span className="text-white font-medium">{selectedColor.name}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>UPHOLSTERY:</span> <span className="text-white font-medium">{selectedInterior.name}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>ESTIMATED MSRP:</span> <span className="text-[#41adff] font-bold">${totalMSRP.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                audioSynth.playUiTick(1200);
                setIsSubmitted(false);
                onClose();
              }}
              className="px-8 py-3.5 rounded-full text-xs font-bold tracking-wider text-white bg-[#1c69d4] hover:bg-[#0066b1] transition-all shadow-[0_0_20px_rgba(28,105,212,0.5)]"
            >
              RETURN TO SHOWCASE
            </button>
          </div>
        ) : (
          /* Main Configurator Studio */
          <>
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#41adff]" />
                <span className="text-[10px] font-mono-tech tracking-[0.2em] text-[#41adff] uppercase">
                  BMW Individual Digital Atelier
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                Configure Your Flagship 7 Series
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto pr-1 flex-1">
              {/* Left 2 Cols: Step Options */}
              <div className="lg:col-span-2 space-y-8">
                {/* 1. Powertrain Model */}
                <div>
                  <label className="block text-xs font-mono-tech tracking-wider text-white/60 uppercase mb-3">
                    1. Select Powertrain & Performance
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {MODELS.map((model) => {
                      const isSelected = selectedModel.id === model.id;
                      return (
                        <button
                          key={model.id}
                          onClick={() => {
                            audioSynth.playUiTick(1500);
                            setSelectedModel(model);
                          }}
                          className={`p-4 rounded-xl border text-left transition-all ${isSelected
                              ? 'bg-[#1c69d4]/15 border-[#1c69d4] shadow-[0_0_15px_rgba(28,105,212,0.3)]'
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                            }`}
                        >
                          <div className="text-xs font-bold text-white mb-1">{model.name}</div>
                          <div className="text-[10px] font-mono-tech text-white/50 mb-2">{model.engine}</div>
                          <div className="flex items-center justify-between text-[11px] font-mono-tech pt-2 border-t border-white/10">
                            <span className="text-[#41adff]">{model.hp}</span>
                            <span className="text-white/80">${model.basePrice.toLocaleString()}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Paint Choice */}
                <div>
                  <label className="block text-xs font-mono-tech tracking-wider text-white/60 uppercase mb-3">
                    2. Exterior Finish: <span className="text-white font-bold">{selectedColor.name}</span>
                  </label>
                  <div className="grid grid-cols-6 gap-2 sm:gap-3">
                    {PAINT_OPTIONS.map((color) => {
                      const isSelected = selectedColor.id === color.id;
                      return (
                        <button
                          key={color.id}
                          onClick={() => {
                            audioSynth.playUiTick(1600);
                            onSelectColor(color);
                          }}
                          className={`relative aspect-square rounded-xl transition-all border flex items-center justify-center ${isSelected
                              ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                              : 'border-white/20 hover:border-white/40'
                            }`}
                          style={{ backgroundColor: color.swatch }}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Wheels */}
                <div>
                  <label className="block text-xs font-mono-tech tracking-wider text-white/60 uppercase mb-3">
                    3. Wheels & Performance Tires
                  </label>
                  <div className="space-y-2">
                    {WHEELS.map((wheel) => {
                      const isSelected = selectedWheel.id === wheel.id;
                      return (
                        <button
                          key={wheel.id}
                          onClick={() => {
                            audioSynth.playUiTick(1400);
                            setSelectedWheel(wheel);
                          }}
                          className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${isSelected
                              ? 'bg-[#1c69d4]/15 border-[#1c69d4]'
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                            }`}
                        >
                          <div className="text-left">
                            <div className="text-xs font-semibold text-white">{wheel.name}</div>
                            <div className="text-[10px] font-mono-tech text-white/40">{wheel.type}</div>
                          </div>
                          <span className="text-xs font-mono-tech text-white/80">
                            {wheel.price === 0 ? 'Included' : `+$${wheel.price.toLocaleString()}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Interior Upholstery */}
                <div>
                  <label className="block text-xs font-mono-tech tracking-wider text-white/60 uppercase mb-3">
                    4. Interior Merino Leather Upholstery
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {INTERIORS.map((interior) => {
                      const isSelected = selectedInterior.id === interior.id;
                      return (
                        <button
                          key={interior.id}
                          onClick={() => {
                            audioSynth.playUiTick(1400);
                            setSelectedInterior(interior);
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${isSelected
                              ? 'bg-[#1c69d4]/15 border-[#1c69d4]'
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                            }`}
                        >
                          <div
                            className="w-5 h-5 rounded-full border border-white/20 mb-2"
                            style={{ backgroundColor: interior.swatch }}
                          />
                          <div className="text-xs font-semibold text-white mb-1">{interior.name}</div>
                          <div className="text-[10px] font-mono-tech text-white/50">
                            {interior.price === 0 ? 'Included' : `+$${interior.price.toLocaleString()}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Packages */}
                <div>
                  <label className="block text-xs font-mono-tech tracking-wider text-white/60 uppercase mb-3">
                    5. Equipment & Bespoke Packages
                  </label>
                  <div className="space-y-2.5">
                    {PACKAGES.map((pkg) => {
                      const isSelected = selectedPackages.includes(pkg.id);
                      return (
                        <button
                          key={pkg.id}
                          onClick={() => togglePackage(pkg.id)}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between gap-4 transition-all ${isSelected
                              ? 'bg-[#1c69d4]/15 border-[#1c69d4]'
                              : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border transition-colors ${isSelected ? 'bg-[#1c69d4] border-[#1c69d4]' : 'border-white/30'
                                }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-white">{pkg.name}</div>
                              <div className="text-[11px] text-white/50 leading-relaxed font-light">{pkg.desc}</div>
                            </div>
                          </div>
                          <span className="text-xs font-mono-tech text-white/80 whitespace-nowrap">
                            +${pkg.price.toLocaleString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Col: Live Summary & Submission Box */}
              <div className="lg:col-span-1">
                <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 sticky top-0">
                  <div className="text-[10px] font-mono-tech tracking-widest text-[#41adff] uppercase mb-1">
                    Bespoke Build Summary
                  </div>
                  <h4 className="text-xl font-bold text-white font-display mb-4">
                    {selectedModel.name}
                  </h4>

                  {/* Summary list */}
                  <div className="space-y-2 text-xs font-mono-tech pb-4 border-b border-white/10 mb-4">
                    <div className="flex justify-between text-white/60">
                      <span>Base Vehicle</span>
                      <span className="text-white">${selectedModel.basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>{selectedColor.name}</span>
                      <span className="text-white">$0</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Wheels</span>
                      <span className="text-white">${selectedWheel.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Interior</span>
                      <span className="text-white">${selectedInterior.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Selected Packages ({selectedPackages.length})</span>
                      <span className="text-white">${packagesTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Total MSRP */}
                  <div className="mb-6">
                    <div className="text-[10px] font-mono-tech text-white/40 uppercase">TOTAL ESTIMATED MSRP</div>
                    <div className="text-3xl font-extrabold text-white font-display text-metallic">
                      ${totalMSRP.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-mono-tech text-white/50 mt-1">
                      Est. ${estimatedMonthly.toLocaleString()}/mo • 60 mo lease
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitBuild}
                    className="w-full py-3.5 rounded-full text-xs font-bold tracking-wider text-white bg-[#1c69d4] hover:bg-[#0066b1] transition-all shadow-[0_0_25px_rgba(28,105,212,0.5)] flex items-center justify-center gap-2 mb-3"
                  >
                    <span>SUBMIT TO CONCIERGE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-[10px] font-mono-tech text-center text-white/40 leading-tight">
                    Custom order allocation direct from BMW Group Plant Dingolfing.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
