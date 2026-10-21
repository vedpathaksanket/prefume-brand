/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const MaisonStory: React.FC = () => {
  const pillars = [
    {
      num: '01. Sourcing',
      title: 'Sacred & Rare Botanicals',
      desc: 'From aged Cambodian agarwood harvested through ethical forestry to centifolia roses gathered at dawn before the sun dissipates their volatile dew, every botanical is sourced at peak olfactory potency.',
      badge: 'Pure Unadulterated Extraits',
    },
    {
      num: '02. Maturation',
      title: '180-Day Barrel Maceration',
      desc: 'Our perfume concentrates sleep for six months inside charred French Limousin oak casks. This patient resting period softens alcohol edges and binds resins with oils, yielding unprecedented roundness and depth.',
      badge: 'Aged in Bordeaux & Grasse Cellars',
    },
    {
      num: '03. Flacon Craft',
      title: 'Architectural Flint Glass',
      desc: 'Every Aura flacon is molded from high-density Italian crystal flint glass with a weighted base and magnetic brushed brass cap. Designed as an heirloom object worthy of sacred vanity tables.',
      badge: 'Refillable Hand-Polished Vessel',
    },
  ];

  return (
    <motion.section
      id="maison"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full py-20 lg:py-28 border-b border-white/[0.06] bg-[#07080c]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Editorial Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-16"
        >
          <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#d4af37] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Maison Philosophy & Provenance</span>
          </div>
          <h2
            className="text-3xl sm:text-5xl font-light text-white tracking-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            The Alchemy of Time, Skin & Spirit
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
            Founded in Grasse, the historic cradle of French perfumery, Maison Aura rejects synthetic
            mass-production. We practice the patient art of slow maceration — pairing ancient natural
            resins with boundary-pushing molecular accords to create perfumes that become part of your aura.
          </p>
        </motion.div>

        {/* 3 Pillars Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: idx * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -6 }}
              className="liquid-glass rounded-2xl p-8 border border-white/[0.08] hover:border-[#d4af37]/35 transition-colors flex flex-col justify-between shadow-xl"
            >
              <div>
                <span className="text-xs font-mono text-[#d4af37] tracking-widest uppercase mb-4 block">
                  {pillar.num}
                </span>
                <h3
                  className="text-2xl text-white font-medium mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {pillar.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>
              <div className="pt-6 border-t border-white/[0.06] mt-6 text-[11px] text-zinc-500 font-mono">
                {pillar.badge}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
