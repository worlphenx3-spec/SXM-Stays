import { SlidersHorizontal, Bed, DollarSign, Waves, Droplets, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Filters } from '@/types';

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  activeCount: number;
}

export function FilterBar({ filters, onChange, activeCount }: FilterBarProps) {
  const bedsOptions = [0, 1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Bedrooms */}
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-stone-300 text-sm font-medium text-stone-700 hover:border-stone-400 hover:bg-stone-50 transition-colors">
          <Bed className="w-4 h-4 text-stone-500" />
          <span>{filters.beds === 0 ? 'Any beds' : `${filters.beds}+ beds`}</span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        </button>
        <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-40 hidden group-hover:block min-w-[120px]">
          {bedsOptions.map((n) => (
            <button
              key={n}
              onClick={() => onChange({ ...filters, beds: n })}
              className={cn(
                'w-full text-left px-4 py-2 text-sm font-medium transition-colors hover:bg-stone-50',
                filters.beds === n ? 'text-brand-600 bg-brand-50/50' : 'text-stone-700'
              )}
            >
              {n === 0 ? 'Any beds' : `${n}+ beds`}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-stone-300 text-sm font-medium text-stone-700 hover:border-stone-400 hover:bg-stone-50 transition-colors">
          <DollarSign className="w-4 h-4 text-stone-500" />
          <span>
            {filters.minPrice === 0 && filters.maxPrice >= 1000
              ? 'Any price'
              : `$${filters.minPrice}–${filters.maxPrice >= 1000 ? '1000+' : filters.maxPrice}`}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        </button>
        <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-40 hidden group-hover:block min-w-[240px]">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Min: ${filters.minPrice}</label>
              <input
                type="range"
                min={0}
                max={800}
                step={50}
                value={filters.minPrice}
                onChange={(e) => onChange({ ...filters, minPrice: Number(e.target.value) })}
                className="w-full accent-brand-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Max: {filters.maxPrice >= 1000 ? '$1000+' : `$${filters.maxPrice}`}</label>
              <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={filters.maxPrice}
                onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-brand-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Beachfront toggle */}
      <button
        onClick={() => onChange({ ...filters, beachfrontOnly: !filters.beachfrontOnly })}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-all',
          filters.beachfrontOnly
            ? 'border-brand-600 bg-brand-50 text-brand-700'
            : 'border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
        )}
      >
        <Waves className="w-4 h-4" />
        Beachfront
      </button>

      {/* Pool toggle */}
      <button
        onClick={() => onChange({ ...filters, poolOnly: !filters.poolOnly })}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-all',
          filters.poolOnly
            ? 'border-brand-600 bg-brand-50 text-brand-700'
            : 'border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
        )}
      >
        <Droplets className="w-4 h-4" />
        Pool
      </button>

      {/* Clear filters */}
      {activeCount > 0 && (
        <button
          onClick={() => onChange({ beds: 0, minPrice: 0, maxPrice: 1000, beachfrontOnly: false, poolOnly: false })}
          className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold text-stone-500 hover:text-stone-700 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear ({activeCount})
        </button>
      )}

      {/* Indicator */}
      {activeCount > 0 && (
        <span className="flex items-center gap-1 text-xs text-brand-600 font-semibold ml-1">
          <SlidersHorizontal className="w-3 h-3" />
          {activeCount} active
        </span>
      )}
    </div>
  );
}
