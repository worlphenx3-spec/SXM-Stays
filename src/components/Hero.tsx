import { Search, MapPin, Users, ArrowRight } from 'lucide-react';
import { heroImage, dutchLocations, frenchLocations } from '@/data/properties';
import type { SxmLocation } from '@/types';

interface HeroProps {
  onSearch: (query: string) => void;
  selectedLocation: SxmLocation | 'All';
  onLocationChange: (loc: SxmLocation | 'All') => void;
}

export function Hero({ onSearch, selectedLocation, onLocationChange }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Sint Maarten beach with plane landing at Maho"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        <div className="animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-medium mb-6 border border-white/20">
            Sint Maarten · Saint Martin · 23 areas
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          Your Caribbean
          <br />
          <span className="italic font-light">home away from home</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          Browse handpicked vacation rentals across both sides of the island — from Maho beachfront lofts to Orient Bay villas and Grand Case lofts. Book your island escape with confidence.
        </p>

        {/* Search Card */}
        <div className="mt-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row items-stretch gap-2">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-50 transition-colors text-left">
              <MapPin className="w-5 h-5 text-brand-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide">Area</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => onLocationChange(e.target.value as SxmLocation | 'All')}
                  className="w-full outline-none text-stone-900 text-sm bg-transparent cursor-pointer"
                >
                  <option value="All">All areas</option>
                  <optgroup label="Dutch Side (Sint Maarten)">
                    {dutchLocations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                  </optgroup>
                  <optgroup label="French Side (Saint-Martin)">
                    {frenchLocations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="hidden sm:block w-px bg-stone-200 my-2" />

            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-50 transition-colors text-left">
              <Search className="w-5 h-5 text-brand-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide">Search</label>
                <input
                  type="text"
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Property name or type"
                  className="w-full outline-none text-stone-900 placeholder:text-stone-400 text-sm bg-transparent"
                />
              </div>
            </div>

            <div className="hidden sm:block w-px bg-stone-200 my-2" />

            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-50 transition-colors text-left">
              <Users className="w-5 h-5 text-brand-600 shrink-0" />
              <div className="flex-1">
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide">Guests</label>
                <span className="text-sm text-stone-400">Add guests</span>
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg group">
              <Search className="w-5 h-5" />
              <span className="sm:hidden lg:inline">Search</span>
            </button>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          {[
            { value: '160+', label: 'Properties' },
            { value: '23', label: 'Areas' },
            { value: '4.9', label: 'Avg rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/70 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <a
          href="#properties"
          className="inline-flex items-center gap-2 mt-14 text-white/80 hover:text-white text-sm font-medium transition-colors animate-fade-in-up"
          style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
        >
          Browse featured stays
          <ArrowRight className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
