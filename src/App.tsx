import { useState, useMemo, useEffect } from 'react';
import { Map as MapIcon, LayoutGrid } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CategoryBar } from '@/components/CategoryBar';
import { FilterBar } from '@/components/FilterBar';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyModal } from '@/components/PropertyModal';
import { MapView } from '@/components/MapView';
import { HostModal } from '@/components/HostModal';
import { AuthModal } from '@/components/AuthModal';
import { Footer } from '@/components/Footer';
import { properties, dutchLocations, frenchLocations, defaultFilters } from '@/data/properties';
import type { Property, SxmLocation, Filters } from '@/types';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<SxmLocation | 'All'>('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.beds > 0) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 1000) count++;
    if (filters.beachfrontOnly) count++;
    if (filters.poolOnly) count++;
    return count;
  }, [filters]);

  const filteredProperties = useMemo(() => {
    let result = properties;

    if (selectedLocation !== 'All') {
      result = result.filter((p) => p.location === selectedLocation);
    }

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (showFavoritesOnly) {
      result = result.filter((p) => favorites.has(p.id));
    }

    if (filters.beds > 0) {
      result = result.filter((p) => p.beds >= filters.beds);
    }

    if (filters.minPrice > 0) {
      result = result.filter((p) => p.pricePerNight >= filters.minPrice);
    }

    if (filters.maxPrice < 1000) {
      result = result.filter((p) => p.pricePerNight <= filters.maxPrice);
    }

    if (filters.beachfrontOnly) {
      result = result.filter((p) => p.isBeachfront);
    }

    if (filters.poolOnly) {
      result = result.filter((p) => p.hasPool);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [selectedLocation, activeCategory, searchQuery, showFavoritesOnly, favorites, filters]);

  const featuredProperties = useMemo(
    () => properties.filter((p) => p.isFeatured),
    []
  );

  const hasActiveFilters = searchQuery || selectedLocation !== 'All' || activeCategory !== 'All' || showFavoritesOnly || activeFilterCount > 0;

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All');
    setActiveCategory('All');
    setShowFavoritesOnly(false);
    setFilters(defaultFilters);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        onBecomeHost={() => setHostModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <Hero
        onSearch={setSearchQuery}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />

      <CategoryBar selected={activeCategory} onSelect={setActiveCategory} />

      {/* Main content */}
      <main id="properties" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Featured section */}
        {!hasActiveFilters && (
          <section className="mb-14">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
                  Featured stays in Sint Maarten
                </h2>
                <p className="text-stone-500 mt-1">Handpicked properties our guests love most</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => setSelectedProperty(property)}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.has(property.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* All properties / search results */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : selectedLocation !== 'All'
                  ? `Stays in ${selectedLocation}`
                  : 'Explore all stays'}
              </h2>
              <p className="text-stone-500 mt-1">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
                {activeCategory !== 'All' && ` · ${activeCategory}`}
                {selectedLocation !== 'All' && ` · ${selectedLocation}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <FilterBar filters={filters} onChange={setFilters} activeCount={activeFilterCount} />

              {/* View toggle */}
              <div className="flex items-center rounded-full border border-stone-300 p-0.5 shrink-0">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    viewMode === 'list' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    viewMode === 'map' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <MapIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>

              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shrink-0 ${
                  showFavoritesOnly
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'border border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                }`}
              >
                <span className="text-base">{showFavoritesOnly ? '♥' : '♡'}</span>
                <span className="hidden sm:inline">Favorites</span>
                {favorites.size > 0 && (
                  <span className={`text-xs rounded-full px-1.5 py-0.5 ${showFavoritesOnly ? 'bg-white/20' : 'bg-stone-100 text-stone-600'}`}>
                    {favorites.size}
                  </span>
                )}
              </button>
            </div>
          </div>

          {filteredProperties.length > 0 ? (
            viewMode === 'map' ? (
              <MapView properties={filteredProperties} onSelectProperty={setSelectedProperty} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => setSelectedProperty(property)}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.has(property.id)}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🏖️</div>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-2">No properties found</h3>
              <p className="text-stone-500 mb-6 max-w-md mx-auto">
                {showFavoritesOnly
                  ? "You haven't saved any favorites yet. Tap the heart icon on any property to save it here."
                  : "Try adjusting your search, area, category, or filters to find your perfect Sint Maarten stay."}
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 rounded-full bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* Why book with us */}
        {!hasActiveFilters && (
          <section className="mt-20 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🛡️',
                title: 'Secure booking',
                text: 'Every inquiry is reviewed by the host before any payment is processed. No hidden fees, no surprises.',
              },
              {
                icon: '🏝️',
                title: 'Local expertise',
                text: 'Our hosts live on the island and know Sint Maarten inside out. Get authentic recommendations for the best stay.',
              },
              {
                icon: '🌊',
                title: 'Both sides of the island',
                text: 'From Dutch-side Maho to French-side Grand Case, we cover every corner of Sint Maarten and Saint-Martin.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-stone-200 p-6 hover:shadow-lg hover:border-brand-300 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-display text-lg font-bold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </section>
        )}

        {/* Area highlights */}
        {!hasActiveFilters && (
          <section className="mt-16">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              Explore by area
            </h2>
            <p className="text-stone-500 mb-6">Dutch and French side neighborhoods, each with its own Caribbean character</p>
            <div className="space-y-6">
              {/* Dutch side */}
              <div>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-3">Dutch Side (Sint Maarten)</p>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                  {dutchLocations.map((loc) => {
                    const count = properties.filter((p) => p.location === loc).length;
                    return (
                      <button
                        key={loc}
                        onClick={() => setSelectedLocation(loc)}
                        className="rounded-xl border border-stone-200 p-4 text-left hover:border-brand-400 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="font-display text-sm font-bold text-stone-900 group-hover:text-brand-600 transition-colors">
                          {loc}
                        </div>
                        <div className="text-xs text-stone-500 mt-1">{count} {count === 1 ? 'stay' : 'stays'}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* French side */}
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">French Side (Saint-Martin)</p>
                <div className="grid grid-cols-2 md:grid-cols-9 gap-3">
                  {frenchLocations.map((loc) => {
                    const count = properties.filter((p) => p.location === loc).length;
                    return (
                      <button
                        key={loc}
                        onClick={() => setSelectedLocation(loc)}
                        className="rounded-xl border border-stone-200 p-4 text-left hover:border-brand-400 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="font-display text-sm font-bold text-stone-900 group-hover:text-brand-600 transition-colors">
                          {loc}
                        </div>
                        <div className="text-xs text-stone-500 mt-1">{count} {count === 1 ? 'stay' : 'stays'}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <PropertyModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        isFavorite={selectedProperty ? favorites.has(selectedProperty.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      <HostModal open={hostModalOpen} onClose={() => setHostModalOpen(false)} />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Back to top */}
      {scrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-stone-900 text-white shadow-xl hover:bg-stone-800 flex items-center justify-center transition-all animate-fade-in z-40"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default App;
