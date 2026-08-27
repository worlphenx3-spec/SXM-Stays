import { useState } from 'react';
import { MapPin, Star, X, Waves, Droplets, ExternalLink, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Property } from '@/types';

interface MapViewProps {
  properties: Property[];
  onSelectProperty: (p: Property) => void;
}

const ISLAND_BOUNDS = {
  minLat: 17.99,
  maxLat: 18.13,
  minLng: -63.14,
  maxLng: -62.98,
};

export function MapView({ properties, onSelectProperty }: MapViewProps) {
  const [hovered, setHovered] = useState<Property | null>(null);
  const [selected, setSelected] = useState<Property | null>(null);

  const project = (lat: number, lng: number) => {
    const x = ((lng - ISLAND_BOUNDS.minLng) / (ISLAND_BOUNDS.maxLng - ISLAND_BOUNDS.minLng)) * 100;
    const y = ((ISLAND_BOUNDS.maxLat - lat) / (ISLAND_BOUNDS.maxLat - ISLAND_BOUNDS.minLat)) * 100;
    return { x, y };
  };

  const activePin = selected || hovered;

  const handlePinClick = (p: Property) => {
    setSelected(selected?.id === p.id ? null : p);
  };

  const tierColors: Record<string, string> = {
    native: 'bg-brand-600 border-brand-700',
    ota: 'bg-rose-500 border-rose-600',
    external: 'bg-stone-700 border-stone-800',
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-stone-200 bg-gradient-to-br from-sky-100 via-blue-50 to-teal-50">
      {/* Stylized island background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Water gradient */}
        <defs>
          <radialGradient id="landGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="50%" stopColor="#bef264" />
            <stop offset="100%" stopColor="#fde68a" />
          </radialGradient>
        </defs>
        {/* Stylized island shape - Sint Maarten / Saint Martin */}
        <path
          d="M 20 35 Q 15 30 18 25 Q 25 18 35 20 Q 45 15 55 18 Q 65 14 72 20 Q 80 18 82 28 Q 85 35 80 42 Q 78 50 70 55 Q 75 62 70 70 Q 62 75 55 72 Q 48 78 40 75 Q 32 72 28 65 Q 22 58 25 50 Q 18 45 20 35 Z"
          fill="url(#landGrad)"
          stroke="#65a30d"
          strokeWidth="0.3"
          opacity="0.7"
        />
        {/* Lagoon shape */}
        <ellipse cx="48" cy="48" rx="6" ry="4" fill="#7dd3fc" opacity="0.5" />
        {/* Airport strip indicator */}
        <rect x="28" y="38" width="3" height="0.8" fill="#9ca3af" opacity="0.6" rx="0.2" />
      </svg>

      {/* Dutch/French side labels */}
      <div className="absolute top-[30%] left-[25%] text-[10px] font-bold text-orange-500/60 uppercase tracking-wider pointer-events-none">
        Dutch Side
      </div>
      <div className="absolute top-[30%] right-[20%] text-[10px] font-bold text-blue-500/60 uppercase tracking-wider pointer-events-none">
        French Side
      </div>

      {/* Property pins */}
      {properties.map((p) => {
        const { x, y } = project(p.coords.lat, p.coords.lng);
        if (x < 0 || x > 100 || y < 0 || y > 100) return null;
        const isActive = activePin?.id === p.id;
        return (
          <button
            key={p.id}
            onClick={() => handlePinClick(p)}
            onMouseEnter={() => setHovered(p)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              'absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10',
              isActive ? 'z-30 scale-125' : 'z-10 hover:scale-110'
            )}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full border-2 shadow-lg text-white text-xs font-bold whitespace-nowrap transition-all',
              tierColors[p.tier],
              isActive && 'ring-2 ring-white'
            )}>
              <span>${p.pricePerNight}</span>
            </div>
          </button>
        );
      })}

      {/* Preview card on pin hover/click */}
      {activePin && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-scale-in z-40">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors z-10"
          >
            <X className="w-4 h-4 text-stone-600" />
          </button>
          <img
            src={activePin.images[0]}
            alt={activePin.title}
            className="w-full h-32 object-cover cursor-pointer"
            onClick={() => onSelectProperty(activePin)}
          />
          <div className="p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-stone-900 text-sm leading-tight">{activePin.title}</h3>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-3 h-3 fill-stone-900 text-stone-900" />
                <span className="text-xs font-semibold">{activePin.rating}</span>
              </div>
            </div>
            <p className="text-xs text-stone-500 flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3" /> {activePin.location}
              <span className={cn(
                'ml-1 px-1.5 py-0.5 rounded text-[9px] font-semibold',
                activePin.side === 'French' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
              )}>
                {activePin.side}
              </span>
            </p>
            <div className="flex items-center gap-2 mb-3">
              {activePin.isBeachfront && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-stone-600">
                  <Waves className="w-3 h-3" /> Beachfront
                </span>
              )}
              {activePin.hasPool && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-stone-600">
                  <Droplets className="w-3 h-3" /> Pool
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900">${activePin.pricePerNight}<span className="text-xs font-normal text-stone-500">/night</span></span>
              <button
                onClick={() => onSelectProperty(activePin)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
              >
                <Zap className="w-3 h-3" />
                View details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-stone-200 p-3 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-medium text-stone-700">
          <span className="w-3 h-3 rounded-full bg-brand-600" /> Book Direct
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-stone-700">
          <span className="w-3 h-3 rounded-full bg-rose-500" /> Airbnb / OTA
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-stone-700">
          <span className="w-3 h-3 rounded-full bg-stone-700" /> Host Site
        </div>
      </div>
    </div>
  );
}
