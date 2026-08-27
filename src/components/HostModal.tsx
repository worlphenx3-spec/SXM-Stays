import { useEffect } from 'react';
import { X, ExternalLink, Building2, BarChart3, CalendarCheck, Shield } from 'lucide-react';

interface HostModalProps {
  open: boolean;
  onClose: () => void;
}

export function HostModal({ open, onClose }: HostModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header banner */}
        <div className="bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-6 h-6 text-white" />
            <span className="text-white/80 text-sm font-semibold tracking-wide uppercase">Atlas Stay Host Engine</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white leading-tight">
            List your property on SXM Stays
          </h2>
          <p className="text-white/75 text-sm mt-2">
            Property owners are directed to the Atlas Stay Host Engine to manage listings, calendars, and bookings.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <div className="space-y-3 mb-6">
            {[
              { icon: BarChart3, title: 'Smart pricing tools', text: 'Optimize rates with market data and demand forecasting' },
              { icon: CalendarCheck, title: 'Unified calendar', text: 'Sync availability across all booking platforms' },
              { icon: Shield, title: 'Host protection', text: 'Comprehensive coverage and verified guest screening' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900 text-sm">{title}</p>
                  <p className="text-sm text-stone-500">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="https://atlas-stay-host-engine.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
          >
            Open Atlas Stay Host Engine
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-center text-xs text-stone-400 mt-3">
            You'll be redirected to the Host Engine in a new tab
          </p>
        </div>
      </div>
    </div>
  );
}
