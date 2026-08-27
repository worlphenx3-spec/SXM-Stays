import { useState, useEffect, useRef } from 'react';
import {
  Search, MapPin, Menu, User, Heart, X, ChevronDown,
  Calendar, HelpCircle, ExternalLink, LogIn, UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { dutchLocations, frenchLocations } from '@/data/properties';
import type { SxmLocation } from '@/types';

interface NavbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  selectedLocation: SxmLocation | 'All';
  onLocationChange: (loc: SxmLocation | 'All') => void;
  onBecomeHost: () => void;
  onOpenAuth: () => void;
}

export function Navbar({ onSearch, searchQuery, selectedLocation, onLocationChange, onBecomeHost, onOpenAuth }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) setLocationOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const renderLocationButton = (loc: SxmLocation | 'All', label: string) => (
    <button
      key={loc}
      onClick={() => { onLocationChange(loc); setLocationOpen(false); }}
      className={cn(
        'w-full text-left px-4 py-2 text-sm font-medium transition-colors hover:bg-stone-50 flex items-center gap-2',
        selectedLocation === loc ? 'text-brand-600 bg-brand-50/50' : 'text-stone-700'
      )}
    >
      <MapPin className="w-3.5 h-3.5 text-stone-400" />
      {label}
    </button>
  );

  const accountMenuItems = [
    { icon: LogIn, label: 'Log in', action: () => { onOpenAuth(); setAccountOpen(false); } },
    { icon: UserPlus, label: 'Sign up', action: () => { onOpenAuth(); setAccountOpen(false); } },
    { icon: Calendar, label: 'My Bookings', action: () => {} },
    { icon: Heart, label: 'Saved Stays', action: () => {} },
    { icon: ExternalLink, label: 'Become a Host', action: () => { onBecomeHost(); setAccountOpen(false); } },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-stone-200/60'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo - no "Powered by Atlas" */}
          <a href="#" className="flex items-center gap-2 group shrink-0">
            <div className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
              scrolled ? 'bg-brand-600' : 'bg-white/20 backdrop-blur-md'
            )}>
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className={cn(
              'font-display text-xl font-bold tracking-tight transition-colors',
              scrolled ? 'text-stone-900' : 'text-white'
            )}>
              SXM <span className="text-brand-500">Stays</span>
            </span>
          </a>

          {/* Desktop Location + Search */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-2xl mx-8">
            {/* Location dropdown */}
            <div ref={locationRef} className="relative shrink-0">
              <button
                onClick={() => setLocationOpen(!locationOpen)}
                className={cn(
                  'flex items-center gap-2 rounded-full border py-2.5 pl-4 pr-3 transition-all duration-300',
                  scrolled
                    ? 'border-stone-300 bg-white shadow-sm hover:shadow-md'
                    : 'border-white/30 bg-white/15 backdrop-blur-md hover:bg-white/25'
                )}
              >
                <MapPin className={cn('w-4 h-4', scrolled ? 'text-brand-600' : 'text-white')} />
                <span className={cn(
                  'text-sm font-medium whitespace-nowrap max-w-[100px] truncate',
                  scrolled ? 'text-stone-700' : 'text-white'
                )}>
                  {selectedLocation === 'All' ? 'All areas' : selectedLocation}
                </span>
                <ChevronDown className={cn('w-4 h-4 transition-transform', locationOpen && 'rotate-180', scrolled ? 'text-stone-500' : 'text-white')} />
              </button>
              {locationOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 animate-fade-in z-50 max-h-[70vh] overflow-y-auto">
                  {renderLocationButton('All', 'All areas')}
                  <div className="px-4 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Dutch Side (Sint Maarten)</div>
                  {dutchLocations.map((loc) => renderLocationButton(loc, loc))}
                  <div className="px-4 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-1">French Side (Saint-Martin)</div>
                  {frenchLocations.map((loc) => renderLocationButton(loc, loc))}
                </div>
              )}
            </div>

            {/* Search button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={cn(
                'flex items-center gap-3 flex-1 rounded-full border py-2.5 pl-5 pr-2 transition-all duration-300',
                scrolled
                  ? 'border-stone-300 bg-white shadow-sm hover:shadow-md'
                  : 'border-white/30 bg-white/15 backdrop-blur-md hover:bg-white/25'
              )}
            >
              <Search className={cn('w-4 h-4', scrolled ? 'text-stone-600' : 'text-white')} />
              <span className={cn(
                'text-sm font-medium flex-1 text-left truncate',
                scrolled ? 'text-stone-700' : 'text-white'
              )}>
                {searchQuery || 'Search properties...'}
              </span>
              {searchOpen ? (
                <X className={cn('w-5 h-5 p-0.5 rounded-full', scrolled ? 'bg-stone-100 text-stone-600' : 'bg-white/20 text-white')} />
              ) : (
                <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center">
                  <Search className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </button>
          </div>

          {/* Right Nav */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onBecomeHost}
              className={cn(
                'hidden lg:block px-4 py-2 rounded-full text-sm font-semibold transition-colors',
                scrolled ? 'text-stone-700 hover:bg-stone-100' : 'text-white hover:bg-white/15'
              )}
            >
              Become a Host
            </button>

            {/* Account dropdown - desktop */}
            <div ref={accountRef} className="relative hidden md:block">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className={cn(
                  'flex items-center gap-2 rounded-full border py-2 pl-3 pr-1.5 transition-all',
                  scrolled
                    ? 'border-stone-300 bg-white hover:shadow-md'
                    : 'border-white/30 bg-white/15 backdrop-blur-md hover:bg-white/25'
                )}
              >
                <Menu className={cn('w-4 h-4', scrolled ? 'text-stone-700' : 'text-white')} />
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center',
                  scrolled ? 'bg-stone-700' : 'bg-white/80'
                )}>
                  <User className={cn('w-4 h-4', scrolled ? 'text-white' : 'text-stone-700')} />
                </div>
              </button>

              {accountOpen && (
                <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 animate-fade-in z-50">
                  {accountMenuItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={item.action}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors text-left"
                    >
                      <item.icon className="w-4 h-4 text-stone-400" />
                      {item.label}
                      {item.label === 'Become a Host' && <ExternalLink className="w-3 h-3 text-stone-400 ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                'md:hidden flex items-center gap-2 rounded-full border py-2 pl-3 pr-1.5 transition-all',
                scrolled
                  ? 'border-stone-300 bg-white hover:shadow-md'
                  : 'border-white/30 bg-white/15 backdrop-blur-md hover:bg-white/25'
              )}
            >
              <Menu className={cn('w-4 h-4', scrolled ? 'text-stone-700' : 'text-white')} />
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center',
                scrolled ? 'bg-stone-700' : 'bg-white/80'
              )}>
                <User className={cn('w-4 h-4', scrolled ? 'text-white' : 'text-stone-700')} />
              </div>
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="hidden md:block animate-fade-in pb-4">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search by name, area, or property type..."
                  className="flex-1 outline-none text-stone-900 placeholder:text-stone-400 text-base"
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={() => onSearch('')} className="text-stone-400 hover:text-stone-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-b border-stone-200 animate-fade-in max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-stone-50 mb-2">
              <Search className="w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search properties..."
                className="flex-1 outline-none bg-transparent text-stone-900 placeholder:text-stone-400"
              />
            </div>
            {/* Mobile location filter */}
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Dutch Side</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {(['All', ...dutchLocations] as const).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => onLocationChange(loc)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                      selectedLocation === loc ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                    )}
                  >
                    {loc === 'All' ? 'All areas' : loc}
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">French Side</p>
              <div className="flex flex-wrap gap-2">
                {frenchLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => onLocationChange(loc)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                      selectedLocation === loc ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                    )}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-stone-100 pt-2">
              {accountMenuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-stone-50 text-stone-700 font-medium transition-colors text-left"
                >
                  <item.icon className="w-4 h-4 text-stone-400" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
