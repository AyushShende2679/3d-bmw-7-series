import React from 'react';
import { Sparkles, Check, X } from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';

export const PAINT_OPTIONS = [
  {
    id: 'black-sapphire',
    name: 'Black Sapphire Metallic',
    type: 'Studio Original',
    hex: '#111215',
    swatch: '#111215',
    glow: 'rgba(0, 102, 177, 0.15)',
    intensity: 0
  },
  {
    id: 'tanzanite-blue',
    name: 'Tanzanite Blue II Metallic',
    type: 'BMW Individual Metallic',
    hex: '#1c69d4',
    swatch: '#14468f',
    glow: 'rgba(28, 105, 212, 0.35)',
    intensity: 0.75
  },
  {
    id: 'isle-of-man-green',
    name: 'Isle of Man Green Metallic',
    type: 'M Performance Metallic',
    hex: '#00854d',
    swatch: '#0d5c38',
    glow: 'rgba(16, 185, 129, 0.25)',
    intensity: 0.75
  },
  {
    id: 'frozen-pure-grey',
    name: 'Frozen Pure Grey',
    type: 'BMW Individual Matte',
    hex: '#a3abb8',
    swatch: '#7e8590',
    glow: 'rgba(255, 255, 255, 0.2)',
    intensity: 0.55
  },
  {
    id: 'aventurin-red',
    name: 'Aventurin Red Metallic',
    type: 'BMW Individual Metallic',
    hex: '#a81c33',
    swatch: '#701322',
    glow: 'rgba(220, 38, 38, 0.25)',
    intensity: 0.75
  },
  {
    id: 'mineral-white',
    name: 'Mineral White Metallic',
    type: 'Metallic Paint',
    hex: '#e2e8f4',
    swatch: '#e2e8f0',
    glow: 'rgba(240, 246, 255, 0.3)',
    intensity: 0.50
  }
];

export const ColorCustomizer = ({
  isOpen,
  onClose,
  selectedColor,
  onSelectColor
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-12 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-lg animate-fade-in pointer-events-auto">
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/20 shadow-2xl backdrop-blur-2xl bg-black/85">
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#41adff]" />
            <span className="text-xs font-bold tracking-wider text-white font-display uppercase">
              Exterior Vehicle Paint Finish
            </span>
          </div>
          <button
            onClick={() => {
              audioSynth.playUiTick(1100);
              onClose();
            }}
            className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Selected Paint Title */}
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-white font-display">
            {selectedColor.name}
          </span>
          <span className="text-[10px] font-mono-tech text-white/50 uppercase tracking-wider">
            {selectedColor.type}
          </span>
        </div>

        {/* Color Swatch Selector */}
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
                onMouseEnter={() => audioSynth.playUiTick(1400)}
                title={`${color.name} (${color.type})`}
                className={`relative aspect-square rounded-xl transition-all duration-300 flex items-center justify-center border cursor-pointer ${isSelected
                    ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                    : 'border-white/20 hover:border-white/50 hover:scale-105'
                  }`}
                style={{ backgroundColor: color.swatch }}
              >
                {isSelected && (
                  <Check className="w-4 h-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
