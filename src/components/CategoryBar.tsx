import { cn } from '@/lib/utils';
import { categories } from '@/data/properties';

interface CategoryBarProps {
  selected: string;
  onSelect: (cat: string) => void;
}

const categoryIcons: Record<string, string> = {
  Beachfront: '🏖️',
  Villas: '🏡',
  Apartments: '🏢',
  Luxury: '✨',
  Family: '👨‍👩‍👧',
  Romantic: '💕',
};

export function CategoryBar({ selected, onSelect }: CategoryBarProps) {
  return (
    <div className="sticky top-18 z-30 bg-white/90 backdrop-blur-xl border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 py-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onSelect('All')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-200',
              selected === 'All'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            )}
          >
            🌴 All
          </button>
          {categories.map((cat) => {
            const isActive = selected === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelect(cat)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                )}
              >
                <span className="text-base">{categoryIcons[cat]}</span>
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
