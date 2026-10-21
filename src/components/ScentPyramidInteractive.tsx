/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Clock, Flame, Wind, Droplet, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Perfume } from '../types/perfume';

interface ScentPyramidInteractiveProps {
  perfumes: Perfume[];
  onSelectPerfume: (perfume: Perfume) => void;
  onFilterByNote: (note: string) => void;
}

type PyramidTier = 'top' | 'heart' | 'base';

export const ScentPyramidInteractive: React.FC<ScentPyramidInteractiveProps> = ({
  perfumes,
  onSelectPerfume,
  onFilterByNote,
}) => {
  const [selectedPerfumeId, setSelectedPerfumeId] = useState<string>(perfumes[0].id);
  const [activeTier, setActiveTier] = useState<PyramidTier>('heart');

  const currentPerfume =
    perfumes.find((p) => p.id === selectedPerfumeId) || perfumes[0];

  const tierInfo = {
    top: {
      name: 'Head / Top Notes',
      french: 'Notes de Tête',
      duration: '0 – 30 Minutes',
      evaporation: 'Fast Evaporation (Light molecular weight)',
      icon: Wind,
      color: 'from-amber-400/20 to-amber-500/5',
      borderColor: 'border-amber-400/40',
      description:
        'The opening burst of freshness and volatile aromatics that create the critical first impression. These sparkling citrus, spice, and fruit molecules greet the senses before making way for the heart.',
    },
    heart: {
      name: 'Heart / Middle Notes',
      french: 'Notes de Cœur',
      duration: '2 – 5 Hours',
      evaporation: 'Moderate Evaporation (Medium molecular weight)',
      icon: Droplet,
      color: 'from-[#d4af37]/30 to-[#d4af37]/5',
      borderColor: 'border-[#d4af37]',
      description:
        'The true character and emotional signature of the perfume. Rich florals, precious woods, spices, and resins that emerge after top notes soften, providing body and personality.',
    },
    base: {
      name: 'Foundation / Base Notes',
      french: 'Notes de Fond',
      duration: '6 – 14+ Hours',
      evaporation: 'Slow Fixative (Heavy molecular weight)',
      icon: Flame,
      color: 'from-amber-700/30 to-amber-900/10',
      borderColor: 'border-amber-600/40',
      description:
        'The enduring soul that anchors the perfume onto the skin. Dense oud, balsamic vanillas, dark ambers, and musks that merge with personal skin chemistry for an intimate sillage.',
    },
  };

  return (
    <motion.section
      id="pyramid"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full py-20 lg:py-28 border-b border-white/[0.06] bg-[#07080c]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Olfactory Architecture</span>
          </div>
          <h2
            className="text-3xl sm:text-5xl font-light text-white tracking-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            The Scent Pyramid Deconstructed
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
            Perfumery is four-dimensional art unfolding through time. Select a perfume or click
            through the tiers to explore how temperature, molecular volatility, and skin warmth
            awaken each fragrance layer.
          </p>

          {/* Fragrance Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {perfumes.map((p) => (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPerfumeId(p.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  selectedPerfumeId === p.id
                    ? 'bg-[#d4af37] text-[#08090d] shadow-md shadow-[#d4af37]/20 font-semibold'
                    : 'bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                {p.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Visual Pyramid Geometry */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-center"
          >
            <div className="w-full max-w-md flex flex-col gap-3.5 relative py-4">
              {/* Top Tier (Apex) */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTier('top')}
                className={`w-[65%] mx-auto p-4 rounded-xl text-center cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                  activeTier === 'top'
                    ? 'liquid-glass-gold shadow-xl shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
                    : 'liquid-glass opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-widest uppercase text-[#f3e5ab] font-medium mb-1">
                  <Wind className="w-3 h-3 text-[#d4af37]" />
                  <span>Head Notes · 0-30m</span>
                </div>
                <div className="text-xs text-white font-medium truncate">
                  {currentPerfume.pyramid.top.join(' · ')}
                </div>
              </motion.button>

              {/* Heart Tier (Middle) */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTier('heart')}
                className={`w-[85%] mx-auto p-5 rounded-xl text-center cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                  activeTier === 'heart'
                    ? 'liquid-glass-gold shadow-xl shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
                    : 'liquid-glass opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-widest uppercase text-[#d4af37] font-medium mb-1">
                  <Droplet className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Heart Notes · 2-5h</span>
                </div>
                <div className="text-sm text-white font-medium truncate">
                  {currentPerfume.pyramid.heart.join(' · ')}
                </div>
              </motion.button>

              {/* Base Tier (Foundation) */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTier('base')}
                className={`w-full p-6 rounded-xl text-center cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                  activeTier === 'base'
                    ? 'liquid-glass-gold shadow-xl shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
                    : 'liquid-glass opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-widest uppercase text-[#d4af37] font-medium mb-1">
                  <Flame className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Base Notes · 6-14h</span>
                </div>
                <div className="text-sm text-white font-medium truncate">
                  {currentPerfume.pyramid.base.join(' · ')}
                </div>
              </motion.button>
            </div>

            <p className="text-xs text-zinc-500 mt-4 text-center">
              Click any tier or ingredient below to filter the catalog by that specific note.
            </p>
          </motion.div>

          {/* Right: Detailed Tier Information & Active Note Ingredients */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="liquid-glass rounded-3xl p-8 border border-white/[0.08] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedPerfumeId}-${activeTier}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Header for Active Tier */}
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-5 mb-6">
                    <div>
                      <span className="text-xs tracking-widest uppercase text-[#d4af37] font-mono">
                        {tierInfo[activeTier].french}
                      </span>
                      <h3
                        className="text-2xl sm:text-3xl font-medium text-white tracking-tight"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      >
                        {tierInfo[activeTier].name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300">
                      <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{tierInfo[activeTier].duration}</span>
                    </div>
                  </div>

                  {/* Tier Explanation */}
                  <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-light">
                    {tierInfo[activeTier].description}
                  </p>

                  {/* Active Ingredients in Current Perfume */}
                  <div className="mb-8">
                    <p className="text-xs tracking-wider uppercase text-zinc-400 mb-3 font-medium">
                      Ingredients in {currentPerfume.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentPerfume.pyramid[activeTier].map((note) => (
                        <motion.button
                          key={note}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onFilterByNote(note)}
                          className="px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 text-xs text-[#f3e5ab] font-medium transition-colors flex items-center gap-1.5 cursor-pointer group"
                          title={`Filter collection by ${note}`}
                        >
                          <span>{note}</span>
                          <ArrowRight className="w-3 h-3 text-[#d4af37] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Evaporation & Sillage Metric */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] grid grid-cols-2 gap-4 text-xs text-zinc-400 mb-6">
                    <div>
                      <span className="block text-zinc-500 text-[10px] uppercase tracking-wider mb-1">
                        Volatility Phase
                      </span>
                      <span className="text-white font-medium">{tierInfo[activeTier].evaporation}</span>
                    </div>
                    <div>
                      <span className="block text-zinc-500 text-[10px] uppercase tracking-wider mb-1">
                        Concentration Grade
                      </span>
                      <span className="text-white font-medium">{currentPerfume.concentration} (30% Oil)</span>
                    </div>
                  </div>

                  {/* Direct Link to Inspect Current Perfume */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentPerfume.image}
                        alt={currentPerfume.name}
                        className="w-10 h-10 rounded-lg object-cover border border-white/10"
                      />
                      <div>
                        <p className="text-sm text-white font-medium">{currentPerfume.name}</p>
                        <p className="text-[11px] text-zinc-400">{currentPerfume.category}</p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onSelectPerfume(currentPerfume)}
                      className="liquid-glass-gold rounded-full px-5 py-2 text-xs text-white font-medium cursor-pointer flex items-center gap-1.5"
                    >
                      <span>View Flacon Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
