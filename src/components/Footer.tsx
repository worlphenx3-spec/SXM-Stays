import { MapPin, Twitter, Instagram, Facebook, Globe, ExternalLink } from 'lucide-react';
import { dutchLocations, frenchLocations } from '@/data/properties';

export function Footer() {
  const sections = [
    {
      title: 'Support',
      links: ['Help Center', 'Booking support', 'Safety information', 'Cancellation policy', 'Contact us'],
    },
    {
      title: 'Dutch Side',
      links: dutchLocations.slice(0, 7),
    },
    {
      title: 'French Side',
      links: frenchLocations.slice(0, 7),
    },
    {
      title: 'About',
      links: ['About SXM Stays', 'How it works', 'Careers', 'Privacy', 'Terms'],
    },
  ];

  return (
    <footer className="bg-stone-950 text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    {(section.title === 'Dutch Side' || section.title === 'French Side') ? (
                      <span className="flex items-center gap-1.5 text-sm hover:text-white transition-colors cursor-pointer">
                        <MapPin className="w-3 h-3 text-stone-500" />
                        {link}
                      </span>
                    ) : (
                      <a href="#" className="text-sm hover:text-white transition-colors">{link}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div className="leading-none">
              <span className="font-display text-lg font-bold text-white">
                SXM <span className="text-brand-500">Stays</span>
              </span>
            </div>
            <span className="text-sm text-stone-500 ml-4 hidden sm:inline">© 2026 SXM Stays · Privacy · Terms</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Discreet "Powered by Atlas" watermark linking to host engine */}
            <a
              href="https://atlas-stay-host-engine.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-stone-500 hover:text-stone-300 transition-colors flex items-center gap-1"
            >
              Powered by Atlas
              <ExternalLink className="w-3 h-3" />
            </a>

            <button className="text-sm hover:text-white transition-colors">English</button>
            <button className="text-sm hover:text-white transition-colors">$ USD</button>
            <div className="flex items-center gap-2 ml-2">
              {[Twitter, Instagram, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-stone-800 hover:bg-brand-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
