/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="w-full bg-[#050608] border-t border-white/[0.08] text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-5 space-y-4">
            <h3
              className="text-2xl text-white tracking-[0.2em] uppercase font-light"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              <span className="gold-gradient-text font-normal">Aura</span>
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm font-light">
              Haute Parfumerie hand-formulated in Grasse and bottled in Paris. Discover extraits that
              linger beyond the moment.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                The Scent Journal (Private Releases & Private Previews)
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs py-2">
                  <Check className="w-4 h-4" />
                  <span>Your email has been added to our private register.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full liquid-glass-gold text-white text-xs font-medium hover:scale-105 transition-transform cursor-pointer"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links Column 1: Fragrance Houses */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-white text-xs uppercase tracking-widest font-medium font-mono">
              Collections
            </p>
            <ul className="space-y-2 font-light">
              <li><a href="#collection" className="hover:text-white transition-colors">Obsidian Oud</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Celestial Rose</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Amber Velvet</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">L’Essence d’Or</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Aqua Nocturne</a></li>
            </ul>
          </div>

          {/* Links Column 2: Olfactory Explorations */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-white text-xs uppercase tracking-widest font-medium font-mono">
              Discovery
            </p>
            <ul className="space-y-2 font-light">
              <li><a href="#pyramid" className="hover:text-white transition-colors">Scent Pyramid</a></li>
              <li><a href="#discovery-kit" className="hover:text-white transition-colors">Discovery Set</a></li>
              <li><a href="#maison" className="hover:text-white transition-colors">Grasse Ateliers</a></li>
              <li><a href="#maison" className="hover:text-white transition-colors">Maceration Method</a></li>
            </ul>
          </div>

          {/* Links Column 3: Atelier Coordinates */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-white text-xs uppercase tracking-widest font-medium font-mono">
              Atelier Coordinates
            </p>
            <div className="text-xs space-y-2 text-zinc-400 font-light">
              <p>Place Vendôme, 75001 Paris, France</p>
              <p>Chemin des Parfums, 06130 Grasse, France</p>
              <p className="text-zinc-500 pt-2 font-mono">concierge@aura-parfums.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Baseline Copyright & Legal */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} Maison Aura Haute Parfumerie. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Certificate of Authenticity</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
