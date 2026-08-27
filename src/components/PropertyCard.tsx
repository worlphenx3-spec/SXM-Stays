import { useState } from 'react';
import {
  Heart, Star, MapPin, Bed, Bath, Users, Waves, Droplets,
  ExternalLink, Calendar, Globe, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

export function PropertyCard({ property, onClick, onToggleFavorite, isFavorite }: PropertyCardProps) {
  const [imgIdx, setImgIdx] = useState(0);

  const tierConfig = {
    external: {
      label: 'Visit Host Site',
      icon: Globe,
      className: 'bg-stone-800 hover:bg-stone-900 text-white',
    },
    ota: {
      label: 'View on Airbnb',
      icon: ExternalLink,
      className: 'bg-rose-500 hover:bg-rose-600 text-white',
    },
    native: {
      label: 'Book Direct',
      icon: Zap,
      className: 'bg-brand-600 hover:bg-brand-700 text-white',
    },
  };

  const tier = tierConfig[property.tier];
  const TierIcon = tier.icon;

  const handleTierClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (property.tier === 'native') {
      onClick();
    } else if (property.externalUrl) {
      window.open(property.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article
      className="group cursor-pointer animate-fade-in-up flex flex-col"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
        <img
          src={property.images[imgIdx]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {property.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all',
                  i === imgIdx ? 'bg-white w-4' : 'bg-white/60 hover:bg-white'
                )}
              />
            ))}
          </div>
        )}

        {/* Favorite */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(property.id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all active:scale-90"
          aria-label="Toggle favorite"
        >
          <Heart className={cn('w-5 h-5 transition-all', isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white')} />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {property.isFeatured && (
            <span className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-xs font-semibold">
              Featured
            </span>
          )}
          {property.host.isSuperhost && (
            <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-900 text-xs font-semibold">
              Superhost
            </span>
          )}
        </div>

        {/* Amenity quick tags */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {property.isBeachfront && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 text-[10px] font-semibold">
              <Waves className="w-3 h-3" /> Beachfront
            </span>
          )}
          {property.hasPool && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 text-[10px] font-semibold">
              <Droplets className="w-3 h-3" /> Pool
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mt-3 space-y-1 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-stone-900 text-base leading-tight line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-stone-900 text-stone-900" />
            <span className="text-sm font-medium text-stone-900">{property.rating}</span>
          </div>
        </div>

        <p className="text-sm text-stone-500 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {property.location}
          <span className={cn(
            'ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold',
            property.side === 'French' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
          )}>
            {property.side}
          </span>
        </p>

        <div className="flex items-center gap-4 text-xs text-stone-500 pt-1">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {property.guests} guests
          </span>
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5" /> {property.beds} beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5" /> {property.baths} baths
          </span>
        </div>

        <p className="pt-1.5 text-stone-900">
          <span className="font-bold text-lg">${property.pricePerNight}</span>
          <span className="text-sm text-stone-500"> / night</span>
        </p>

        {/* Tier action button */}
        <button
          onClick={handleTierClick}
          className={cn(
            'flex items-center justify-center gap-2 w-full mt-3 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]',
            tier.className
          )}
        >
          <TierIcon className="w-4 h-4" />
          {tier.label}
          {property.tier !== 'native' && <ExternalLink className="w-3 h-3" />}
        </button>
      </div>
    </article>
  );
}
