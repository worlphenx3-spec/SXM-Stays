import { useState, useEffect } from 'react';
import {
  X, Star, MapPin, Bed, Bath, Users, Heart, Share, Check,
  ChevronLeft, ChevronRight, Send, Loader2, CheckCircle2,
  ExternalLink, Globe, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Property, InquiryForm } from '@/types';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const CLEANING_FEE = 45;
const SERVICE_RATE = 0.08;

export function PropertyModal({ property, onClose, isFavorite, onToggleFavorite }: PropertyModalProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [showAmenities, setShowAmenities] = useState(false);
  const [inquiry, setInquiry] = useState<InquiryForm>({
    name: '', email: '', checkIn: '', checkOut: '', guests: 1, message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (property) {
      setImgIdx(0);
      setShowAmenities(false);
      setInquiry({ name: '', email: '', checkIn: '', checkOut: '', guests: 1, message: '' });
      setSubmitted(false);
      setSubmitting(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [property]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!property) return null;

  const nights = inquiry.checkIn && inquiry.checkOut
    ? Math.max(1, Math.ceil((new Date(inquiry.checkOut).getTime() - new Date(inquiry.checkIn).getTime()) / 86400000))
    : 1;
  const subtotal = property.pricePerNight * nights;
  const cleaningFee = CLEANING_FEE;
  const serviceFee = Math.round(subtotal * SERVICE_RATE);
  const total = subtotal + cleaningFee + serviceFee;

  const canSubmit = inquiry.name.trim() && inquiry.email.trim() && inquiry.checkIn && inquiry.checkOut;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-4xl sm:rounded-3xl rounded-t-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-slide-up sm:animate-scale-in shadow-2xl">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-stone-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-stone-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-stone-700" />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full hover:bg-stone-100 flex items-center justify-center transition-colors">
              <Share className="w-4 h-4 text-stone-700" />
            </button>
            <button
              onClick={() => onToggleFavorite(property.id)}
              className="w-9 h-9 rounded-full hover:bg-stone-100 flex items-center justify-center transition-colors"
            >
              <Heart className={cn('w-5 h-5', isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-700')} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          {/* Gallery */}
          <div className="relative aspect-[16/10] sm:aspect-[2/1] bg-stone-100 overflow-hidden">
            <img
              src={property.images[imgIdx]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {property.images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx((imgIdx - 1 + property.images.length) % property.images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md hover:bg-white shadow-md flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-stone-800" />
                </button>
                <button
                  onClick={() => setImgIdx((imgIdx + 1) % property.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md hover:bg-white shadow-md flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-stone-800" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {property.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        i === imgIdx ? 'bg-white w-5' : 'bg-white/50 w-1.5'
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Body */}
          <div className="px-4 sm:px-6 py-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title section */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {property.host.isSuperhost && (
                      <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
                        Superhost
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold">
                      {property.category}
                    </span>
                    {property.isFeatured && (
                      <span className="px-2.5 py-1 rounded-full bg-stone-900 text-white text-xs font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                    {property.title}
                  </h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-stone-600">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-stone-900 text-stone-900" />
                      <span className="font-semibold text-stone-900">{property.rating}</span>
                      <span className="text-stone-500">({property.reviewCount} reviews)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {property.location} · {property.side === 'French' ? 'Saint-Martin' : 'Sint Maarten'}
                    </span>
                  </div>
                </div>

                {/* Quick facts */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Users, label: `${property.guests} guests` },
                    { icon: Bed, label: `${property.beds} beds` },
                    { icon: Bath, label: `${property.baths} baths` },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 rounded-xl border border-stone-200 px-4 py-3">
                      <Icon className="w-5 h-5 text-stone-500" />
                      <span className="text-sm font-medium text-stone-700">{label}</span>
                    </div>
                  ))}
                </div>

                <hr className="border-stone-200" />

                {/* Host */}
                <div className="flex items-center gap-4">
                  <img
                    src={property.host.avatar}
                    alt={property.host.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-stone-900">
                      Hosted by {property.host.name}
                    </p>
                    <p className="text-sm text-stone-500">
                      Joined in {property.host.joinedYear}
                      {property.host.isSuperhost && ' · Superhost'}
                    </p>
                  </div>
                </div>

                <hr className="border-stone-200" />

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-stone-900 mb-2">About this place</h3>
                  <p className="text-stone-600 leading-relaxed">{property.description}</p>
                </div>

                <hr className="border-stone-200" />

                {/* Amenities */}
                <div>
                  <h3 className="font-semibold text-stone-900 mb-3">What this place offers</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(showAmenities ? property.amenities : property.amenities.slice(0, 6)).map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 text-sm text-stone-700">
                        <Check className="w-4 h-4 text-brand-600 shrink-0" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                  {property.amenities.length > 6 && (
                    <button
                      onClick={() => setShowAmenities(!showAmenities)}
                      className="mt-3 text-sm font-semibold text-stone-900 underline hover:text-brand-600 transition-colors"
                    >
                      {showAmenities ? 'Show less' : `Show all ${property.amenities.length} amenities`}
                    </button>
                  )}
                </div>

                <hr className="border-stone-200" />

                {/* Reviews */}
                <div>
                  <h3 className="font-semibold text-stone-900 mb-4">
                    <Star className="w-4 h-4 fill-stone-900 text-stone-900 inline mr-1" />
                    {property.rating} · {property.reviewCount} reviews
                  </h3>
                  <div className="space-y-4">
                    {property.reviews.map((review, i) => (
                      <div key={i} className="border-b border-stone-100 pb-4 last:border-0">
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={review.avatar}
                            alt={review.author}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-stone-900 text-sm">{review.author}</p>
                            <p className="text-xs text-stone-500">{review.date}</p>
                          </div>
                          <div className="ml-auto flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, s) => (
                              <Star
                                key={s}
                                className={cn(
                                  'w-3.5 h-3.5',
                                  s < review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-stone-600 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column - Booking panel (tier-aware) */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-20 rounded-2xl border border-stone-200 shadow-lg p-5 space-y-4">
                  {/* Nightly rate */}
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-stone-900">${property.pricePerNight}</span>
                      <span className="text-stone-500 text-sm">/ night</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-stone-900 text-stone-900" />
                      <span className="text-sm font-semibold text-stone-900">{property.rating}</span>
                      <span className="text-sm text-stone-500">· {property.reviewCount} reviews</span>
                    </div>
                  </div>

                  {/* Tier badge */}
                  <div className="flex items-center gap-2 text-xs">
                    {property.tier === 'native' && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 font-semibold">
                        <Zap className="w-3 h-3" /> Native Atlas Host · Book Direct
                      </span>
                    )}
                    {property.tier === 'ota' && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 font-semibold">
                        <ExternalLink className="w-3 h-3" /> Airbnb / OTA Listing
                      </span>
                    )}
                    {property.tier === 'external' && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 font-semibold">
                        <Globe className="w-3 h-3" /> External Host Site
                      </span>
                    )}
                  </div>

                  {/* External / OTA redirect panel */}
                  {property.tier !== 'native' ? (
                    <div className="space-y-4">
                      <div className="bg-stone-50 rounded-xl p-4 text-center">
                        <p className="text-sm text-stone-600 leading-relaxed mb-4">
                          {property.tier === 'ota'
                            ? 'This property is managed through an Airbnb or OTA platform. You\'ll be redirected to their external calendar to check availability and complete your booking.'
                            : 'This property is managed through the host\'s own website. You\'ll be redirected to their site to check availability and complete your booking.'}
                        </p>
                        {property.externalUrl && (
                          <a
                            href={property.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'flex items-center justify-center gap-2 w-full font-semibold py-3 rounded-xl transition-all hover:shadow-lg active:scale-[0.98] text-white',
                              property.tier === 'ota' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-stone-800 hover:bg-stone-900'
                            )}
                          >
                            {property.tier === 'ota' ? (
                              <>
                                <ExternalLink className="w-4 h-4" />
                                View on Airbnb
                              </>
                            ) : (
                              <>
                                <Globe className="w-4 h-4" />
                                Visit Host Site
                              </>
                            )}
                          </a>
                        )}
                        <p className="text-center text-xs text-stone-400 mt-3">
                          Opens in a new tab · SXM Stays is not responsible for external booking processes
                        </p>
                      </div>

                      {/* Map placement */}
                      <div className="rounded-xl border border-stone-200 overflow-hidden">
                        <div className="bg-stone-50 px-3 py-2 border-b border-stone-200">
                          <p className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-brand-600" />
                            {property.location} · {property.side === 'French' ? 'Saint-Martin' : 'Sint Maarten'}
                          </p>
                        </div>
                        <div className="relative h-32 bg-gradient-to-br from-sky-100 to-blue-100">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className={cn(
                              'flex items-center gap-1 px-3 py-1.5 rounded-full border-2 shadow-lg text-white text-sm font-bold',
                              property.tier === 'ota' ? 'bg-rose-500 border-rose-600' : 'bg-stone-700 border-stone-800'
                            )}>
                              ${property.pricePerNight}/night
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : submitted ? (
                    <div className="text-center py-8 animate-scale-in">
                      <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-7 h-7 text-brand-600" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-stone-900 mb-2">Inquiry sent!</h3>
                      <p className="text-sm text-stone-500 leading-relaxed">
                        {property.host.name} will receive your reservation request and respond within 24 hours.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="mt-4 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                      >
                        Send another inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wide mb-1">Full name</label>
                        <input
                          type="text"
                          value={inquiry.name}
                          onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-brand-500 transition-colors"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wide mb-1">Email</label>
                        <input
                          type="email"
                          value={inquiry.email}
                          onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-brand-500 transition-colors"
                          required
                        />
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wide mb-1">Check in</label>
                          <input
                            type="date"
                            value={inquiry.checkIn}
                            onChange={(e) => setInquiry({ ...inquiry, checkIn: e.target.value })}
                            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-brand-500 transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wide mb-1">Check out</label>
                          <input
                            type="date"
                            value={inquiry.checkOut}
                            onChange={(e) => setInquiry({ ...inquiry, checkOut: e.target.value })}
                            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-brand-500 transition-colors"
                            required
                          />
                        </div>
                      </div>

                      {/* Guests */}
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wide mb-1">Guests</label>
                        <select
                          value={inquiry.guests}
                          onChange={(e) => setInquiry({ ...inquiry, guests: Number(e.target.value) })}
                          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-brand-500 transition-colors"
                        >
                          {Array.from({ length: property.guests }).map((_, i) => (
                            <option key={i} value={i + 1}>
                              {i + 1} {i === 0 ? 'guest' : 'guests'}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wide mb-1">Message <span className="text-stone-400 normal-case">(optional)</span></label>
                        <textarea
                          value={inquiry.message}
                          onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                          placeholder="Tell the host about your trip..."
                          rows={2}
                          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-brand-500 transition-colors resize-none"
                        />
                      </div>

                      {/* Price breakdown */}
                      {inquiry.checkIn && inquiry.checkOut && (
                        <div className="space-y-2 pt-3 border-t border-stone-200 animate-fade-in">
                          <div className="flex justify-between text-sm text-stone-600">
                            <span>${property.pricePerNight} x {nights} {nights === 1 ? 'night' : 'nights'}</span>
                            <span>${subtotal}</span>
                          </div>
                          <div className="flex justify-between text-sm text-stone-600">
                            <span>Cleaning fee</span>
                            <span>${cleaningFee}</span>
                          </div>
                          <div className="flex justify-between text-sm text-stone-600">
                            <span>Service fee</span>
                            <span>${serviceFee}</span>
                          </div>
                          <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200">
                            <span>Total</span>
                            <span>${total}</span>
                          </div>
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={!canSubmit || submitting}
                        className={cn(
                          'flex items-center justify-center gap-2 w-full font-semibold py-3 rounded-xl transition-all active:scale-[0.98]',
                          canSubmit && !submitting
                            ? 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-lg'
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        )}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Request to book
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-stone-500">You won't be charged yet — this is an inquiry</p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
